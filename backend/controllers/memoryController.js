import Memory from '../models/Memory.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { calculateCringeScore, createMemoryMashup } from '../utils/funFeatures.js';
import { updateUserStats, checkAchievements } from '../utils/achievements.js';

// @desc    Create new memory
// @route   POST /api/memories
// @access  Private
export const createMemory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, type, tags, mood, isPublic } = req.body;

    // Get media URL from uploaded file
    let mediaUrl = null;
    let audioUrl = null;
    
    if (req.files) {
      // Multer avec plusieurs champs
      if (req.files.media && req.files.media[0]) {
        mediaUrl = `/uploads/${req.files.media[0].filename}`;
      }
      if (req.files.audio && req.files.audio[0]) {
        audioUrl = `/uploads/${req.files.audio[0].filename}`;
      }
    } else if (req.file) {
      // Ancien système avec un seul fichier
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    const memory = new Memory({
      title,
      description,
      author: req.userId,
      type,
      mediaUrl,
      audioUrl,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      mood: mood || 'wholesome',
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    // Calculate cringe score
    const cringeData = calculateCringeScore(memory);
    memory.cringeScore = cringeData.score;
    memory.cringeComment = cringeData.comment;

    await memory.save();

    // Add memory to user's memories
    await User.findByIdAndUpdate(req.userId, {
      $push: { memories: memory._id }
    });
    
    // Update user stats and check achievements
    const user = await User.findById(req.userId);
    await updateUserStats(user, 'CREATE_MEMORY');
    
    const memories = await Memory.find({ author: req.userId });
    const newAchievements = await checkAchievements(user, memories);

    const populatedMemory = await Memory.findById(memory._id)
      .populate('author', 'username avatar');

    res.status(201).json({
      message: '🎉 Souvenir créé avec succès !',
      memory: populatedMemory,
      cringeData,
      newAchievements: newAchievements.length > 0 ? newAchievements : undefined
    });
  } catch (error) {
    console.error('Create memory error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du souvenir', 
      error: error.message 
    });
  }
};

// @desc    Get all memories
// @route   GET /api/memories
// @access  Public
export const getAllMemories = async (req, res) => {
  try {
    const { type, mood, search, sortBy = 'createdAt' } = req.query;

    const query = { isPublic: true };

    // Filters
    if (type) query.type = type;
    if (mood) query.mood = mood;
    if (search) {
      query.$text = { $search: search };
    }

    // Récupérer TOUS les souvenirs sans pagination
    const memories = await Memory.find(query)
      .populate('author', 'username avatar')
      .sort({ [sortBy]: -1 })
      .exec();

    const count = await Memory.countDocuments(query);

    res.json({
      memories,
      totalMemories: count
    });
  } catch (error) {
    console.error('Get all memories error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des souvenirs', 
      error: error.message 
    });
  }
};

// @desc    Get single memory
// @route   GET /api/memories/:id
// @access  Public
export const getMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('comments.author', 'username avatar')
      .populate('likes', 'username avatar');

    if (!memory) {
      return res.status(404).json({ 
        message: '👻 Souvenir introuvable' 
      });
    }

    // Increment view count
    memory.viewCount += 1;
    await memory.save();

    res.json({ memory });
  } catch (error) {
    console.error('Get memory error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du souvenir', 
      error: error.message 
    });
  }
};

// @desc    Update memory
// @route   PUT /api/memories/:id
// @access  Private
export const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ 
        message: '👻 Souvenir introuvable' 
      });
    }

    // Check ownership
    if (memory.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        message: '🚫 Tu ne peux modifier que tes propres souvenirs !' 
      });
    }

    const { title, description, tags, mood, isPublic } = req.body;

    if (title) memory.title = title;
    if (description) memory.description = description;
    if (tags) memory.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (mood) memory.mood = mood;
    if (isPublic !== undefined) memory.isPublic = isPublic;

    await memory.save();

    const updatedMemory = await Memory.findById(memory._id)
      .populate('author', 'username avatar');

    res.json({
      message: '✅ Souvenir mis à jour !',
      memory: updatedMemory
    });
  } catch (error) {
    console.error('Update memory error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du souvenir', 
      error: error.message 
    });
  }
};

// @desc    Delete memory
// @route   DELETE /api/memories/:id
// @access  Private
export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ 
        message: '👻 Souvenir introuvable' 
      });
    }

    // Check ownership or admin
    if (memory.author.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '🚫 Tu ne peux supprimer que tes propres souvenirs !' 
      });
    }

    await Memory.findByIdAndDelete(req.params.id);

    // Remove from user's memories
    await User.findByIdAndUpdate(memory.author, {
      $pull: { memories: memory._id }
    });

    res.json({
      message: '🗑️ Souvenir supprimé'
    });
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du souvenir', 
      error: error.message 
    });
  }
};

// @desc    Like/Unlike memory
// @route   POST /api/memories/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ 
        message: '👻 Souvenir introuvable' 
      });
    }

    const likeIndex = memory.likes.indexOf(req.userId);

    if (likeIndex > -1) {
      // Unlike
      memory.likes.splice(likeIndex, 1);
    } else {
      // Like
      memory.likes.push(req.userId);
      
      // Update author karma
      const author = await User.findById(memory.author);
      await updateUserStats(author, 'RECEIVE_LIKE');
    }

    await memory.save();

    res.json({
      message: likeIndex > -1 ? '💔 Like retiré' : '❤️ Like ajouté',
      likesCount: memory.likes.length
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ 
      message: 'Erreur lors du like', 
      error: error.message 
    });
  }
};

// @desc    Add comment to memory
// @route   POST /api/memories/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        message: '💬 Le commentaire ne peut pas être vide' 
      });
    }

    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ 
        message: '👻 Souvenir introuvable' 
      });
    }

    memory.comments.push({
      author: req.userId,
      content: content.trim()
    });

    await memory.save();

    const updatedMemory = await Memory.findById(memory._id)
      .populate('comments.author', 'username avatar');

    res.status(201).json({
      message: '💬 Commentaire ajouté !',
      comments: updatedMemory.comments
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'ajout du commentaire', 
      error: error.message 
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/memories/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ 
        message: '👻 Souvenir introuvable' 
      });
    }

    const comment = memory.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ 
        message: '💬 Commentaire introuvable' 
      });
    }

    // Check ownership or admin
    if (comment.author.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '🚫 Tu ne peux supprimer que tes propres commentaires !' 
      });
    }

    comment.deleteOne();
    await memory.save();

    res.json({
      message: '🗑️ Commentaire supprimé'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du commentaire', 
      error: error.message 
    });
  }
};

export default {
  createMemory,
  getAllMemories,
  getMemory,
  updateMemory,
  deleteMemory,
  toggleLike,
  addComment,
  deleteComment
};

// ========== NEW FEATURES ==========

// @desc    Add reaction to memory
// @route   POST /api/memories/:id/react
// @access  Private
export const addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const validTypes = ['thumbsup', 'thumbsdown', 'laugh', 'party', 'confused', 'heart', 'rocket', 'eyes'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Type de réaction invalide' });
    }
    
    const memory = await Memory.findById(req.params.id);
    
    if (!memory) {
      return res.status(404).json({ message: '👻 Souvenir introuvable' });
    }
    
    // Remove existing reaction from user if any
    memory.reactions = memory.reactions.filter(
      r => r.user.toString() !== req.userId.toString()
    );
    
    // Add new reaction
    memory.reactions.push({
      user: req.userId,
      type
    });
    
    await memory.save();
    
    // Group reactions by type
    const reactionCounts = memory.reactions.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      message: 'Réaction ajoutée !',
      reactions: reactionCounts
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la réaction', error: error.message });
  }
};

// @desc    Add code review to memory
// @route   POST /api/memories/:id/review
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    if (!['approved', 'changes_requested', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Status de review invalide' });
    }
    
    const memory = await Memory.findById(req.params.id);
    
    if (!memory) {
      return res.status(404).json({ message: '👻 Souvenir introuvable' });
    }
    
    // Remove existing review from user if any
    memory.reviews = memory.reviews.filter(
      r => r.reviewer.toString() !== req.userId.toString()
    );
    
    // Add new review
    memory.reviews.push({
      reviewer: req.userId,
      status,
      comment
    });
    
    // Update overall status
    const approvals = memory.reviews.filter(r => r.status === 'approved').length;
    if (approvals >= 2) {
      memory.codeReviewStatus = 'approved';
      
      // Award karma to author
      const author = await User.findById(memory.author);
      author.karma += 15;
      await author.save();
    }
    
    await memory.save();
    
    const populatedMemory = await Memory.findById(memory._id)
      .populate('reviews.reviewer', 'username avatar');
    
    res.json({
      message: '✅ Review ajoutée !',
      reviews: populatedMemory.reviews
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la review', error: error.message });
  }
};

// @desc    Add contributor to memory
// @route   POST /api/memories/:id/contribute
// @access  Private
export const addContributor = async (req, res) => {
  try {
    const { contribution } = req.body;
    
    const memory = await Memory.findById(req.params.id);
    
    if (!memory) {
      return res.status(404).json({ message: '👻 Souvenir introuvable' });
    }
    
    // Check if user is already a contributor
    const isContributor = memory.contributors.some(
      c => c.user.toString() === req.userId.toString()
    );
    
    if (isContributor) {
      return res.status(400).json({ message: 'Tu as déjà contribué à ce souvenir' });
    }
    
    memory.contributors.push({
      user: req.userId,
      contribution,
      addedAt: new Date()
    });
    
    await memory.save();
    
    // Award karma
    const user = await User.findById(req.userId);
    user.karma += 25;
    await user.save();
    
    const populatedMemory = await Memory.findById(memory._id)
      .populate('contributors.user', 'username avatar');
    
    res.json({
      message: '🤝 Contribution ajoutée !',
      contributors: populatedMemory.contributors
    });
  } catch (error) {
    console.error('Add contributor error:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la contribution', error: error.message });
  }
};

// @desc    Create memory mashup
// @route   POST /api/memories/mashup
// @access  Private
export const createMashup = async (req, res) => {
  try {
    const { memory1Id, memory2Id } = req.body;
    
    const memory1 = await Memory.findById(memory1Id);
    const memory2 = await Memory.findById(memory2Id);
    
    if (!memory1 || !memory2) {
      return res.status(404).json({ message: 'Un ou plusieurs souvenirs introuvables' });
    }
    
    const mashupData = createMemoryMashup(memory1, memory2);
    
    res.json({
      message: '🎭 Mashup créé !',
      mashup: mashupData
    });
  } catch (error) {
    console.error('Create mashup error:', error);
    res.status(500).json({ message: 'Erreur lors de la création du mashup', error: error.message });
  }
};

// @desc    Link memories in a chain
// @route   POST /api/memories/:id/chain
// @access  Private
export const chainMemory = async (req, res) => {
  try {
    const { childMemoryId } = req.body;
    
    const parentMemory = await Memory.findById(req.params.id);
    const childMemory = await Memory.findById(childMemoryId);
    
    if (!parentMemory || !childMemory) {
      return res.status(404).json({ message: 'Un ou plusieurs souvenirs introuvables' });
    }
    
    // Link them
    parentMemory.childMemories.push(childMemoryId);
    childMemory.parentMemory = req.params.id;
    
    await parentMemory.save();
    await childMemory.save();
    
    res.json({
      message: '🔗 Souvenirs chaînés !',
      parentMemory,
      childMemory
    });
  } catch (error) {
    console.error('Chain memory error:', error);
    res.status(500).json({ message: 'Erreur lors du chaînage', error: error.message });
  }
};

// @desc    Get memory chain
// @route   GET /api/memories/:id/chain
// @access  Public
export const getMemoryChain = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id)
      .populate('parentMemory')
      .populate('childMemories');
    
    if (!memory) {
      return res.status(404).json({ message: '👻 Souvenir introuvable' });
    }
    
    res.json({
      current: memory,
      parent: memory.parentMemory,
      children: memory.childMemories
    });
  } catch (error) {
    console.error('Get chain error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la chaîne', error: error.message });
  }
};
