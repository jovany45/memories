import IdeaBox from '../models/IdeaBox.js';
import User from '../models/User.js';

// Messages sarcastiques pour les réponses
const sarcasticMessages = {
  created: [
    "🎭 Oh génial, une idée de plus ! On va la mettre dans la pile avec les 47 autres...",
    "✨ Wow, personne n'y avait pensé avant ! (sauf les 12 derniers)",
    "🎪 Bienvenue dans la boîte à idées ! Espérance de vie : 3 jours",
    "🎯 Idée enregistrée ! On va l'étudier... un jour... peut-être...",
    "🌟 Félicitations ! Votre idée va révolutionner... absolument rien"
  ],
  voted: [
    "Vote comptabilisé ! Ça change tout (spoiler: ça change rien)",
    "Merci pour ton vote démocratique qui ne sert à rien ! 🎭",
    "Vote enregistré dans notre système ultra-sophistiqué (Excel 2003)",
    "Ton vote compte ! Enfin... techniquement oui... pratiquement...",
    "Opinion enregistrée ! On va en faire quelque chose (dans nos rêves)"
  ],
  noIdeas: [
    "Personne n'a encore osé se plaindre... euh... proposer des idées !",
    "Le silence est d'or ! (ou personne n'a le courage d'écrire)",
    "Aucune idée ? C'est louche... TRÈS louche...",
    "Soit tout est parfait, soit tout le monde a abandonné 🤷"
  ]
};

const getRandomMessage = (type) => {
  const messages = sarcasticMessages[type];
  return messages[Math.floor(Math.random() * messages.length)];
};

// @desc    Get all ideas
// @route   GET /api/idea-box
// @access  Public
export const getAllIdeas = async (req, res) => {
  try {
    const { category, status, sort = 'recent' } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    let sortOption = {};
    switch (sort) {
      case 'popular':
        // On va trier côté JS car score est virtuel
        break;
      case 'controversial':
        // Idées avec le plus de votes totaux
        break;
      default: // recent
        sortOption = { createdAt: -1 };
    }

    let ideas = await IdeaBox.find(query)
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar')
      .sort(sortOption)
      .lean();

    // Ajouter les scores calculés
    ideas = ideas.map(idea => ({
      ...idea,
      score: (idea.upvotes?.length || 0) - (idea.downvotes?.length || 0),
      totalVotes: (idea.upvotes?.length || 0) + (idea.downvotes?.length || 0),
      upvotesCount: idea.upvotes?.length || 0,
      downvotesCount: idea.downvotes?.length || 0
    }));

    // Tri après calcul des scores
    if (sort === 'popular') {
      ideas.sort((a, b) => b.score - a.score);
    } else if (sort === 'controversial') {
      ideas.sort((a, b) => b.totalVotes - a.totalVotes);
    }

    res.json({
      success: true,
      count: ideas.length,
      ideas,
      sarcasticMessage: ideas.length === 0 ? getRandomMessage('noIdeas') : null
    });
  } catch (error) {
    console.error('Get all ideas error:', error);
    res.status(500).json({ 
      message: '💥 Le serveur a crashé... comme d\'habitude', 
      error: error.message 
    });
  }
};

// @desc    Create new idea
// @route   POST /api/idea-box
// @access  Private
export const createIdea = async (req, res) => {
  try {
    const { title, description, category, isJoke } = req.body;

    const idea = await IdeaBox.create({
      title,
      description,
      category: category || 'autre',
      author: req.userId,
      isJoke: isJoke || false
    });

    const populatedIdea = await IdeaBox.findById(idea._id)
      .populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      idea: populatedIdea,
      sarcasticMessage: getRandomMessage('created')
    });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ 
      message: '🎪 Impossible de créer ton idée révolutionnaire', 
      error: error.message 
    });
  }
};

// @desc    Vote on idea (upvote or downvote)
// @route   POST /api/idea-box/:id/vote
// @access  Private
export const voteIdea = async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const idea = await IdeaBox.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ 
        message: '🔍 Idée introuvable (elle a peut-être fui)' 
      });
    }

    const userId = req.userId;

    // Retirer les votes précédents
    idea.upvotes = idea.upvotes.filter(id => id.toString() !== userId.toString());
    idea.downvotes = idea.downvotes.filter(id => id.toString() !== userId.toString());

    // Ajouter le nouveau vote
    if (voteType === 'up') {
      idea.upvotes.push(userId);
    } else if (voteType === 'down') {
      idea.downvotes.push(userId);
    }

    await idea.save();

    const updatedIdea = await IdeaBox.findById(idea._id)
      .populate('author', 'username avatar')
      .lean();

    res.json({
      success: true,
      idea: {
        ...updatedIdea,
        score: (updatedIdea.upvotes?.length || 0) - (updatedIdea.downvotes?.length || 0),
        upvotesCount: updatedIdea.upvotes?.length || 0,
        downvotesCount: updatedIdea.downvotes?.length || 0
      },
      sarcasticMessage: getRandomMessage('voted')
    });
  } catch (error) {
    console.error('Vote idea error:', error);
    res.status(500).json({ 
      message: '🎯 Erreur de vote (la démocratie est dure)', 
      error: error.message 
    });
  }
};

// @desc    Add comment to idea
// @route   POST /api/idea-box/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const idea = await IdeaBox.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idée introuvable' });
    }

    idea.comments.push({
      author: req.user._id,
      content,
      createdAt: new Date()
    });

    await idea.save();
    await idea.populate('author', 'username avatar');
    await idea.populate('comments.author', 'username avatar');

    res.json({
      success: true,
      message: '💬 Commentaire ajouté !',
      idea
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'ajout du commentaire', 
      error: error.message 
    });
  }
};

// @desc    Delete idea
// @route   DELETE /api/idea-box/:id
// @access  Private (author or admin)
export const deleteIdea = async (req, res) => {
  try {
    const idea = await IdeaBox.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ 
        message: '🕳️ Idée déjà supprimée... ou jamais existée' 
      });
    }

    // Vérifier que c'est l'auteur ou un admin
    const user = await User.findById(req.userId);
    if (idea.author.toString() !== req.userId.toString() && user.role !== 'admin') {
      return res.status(403).json({ 
        message: '🚫 Touche pas aux idées des autres !' 
      });
    }

    await IdeaBox.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '🗑️ Idée supprimée ! (Ouf, elle était nulle de toute façon)'
    });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ 
      message: '💣 Échec de suppression', 
      error: error.message 
    });
  }
};

// @desc    Update idea status (admin only)
// @route   PUT /api/idea-box/:id/status
// @access  Private (admin)
export const updateIdeaStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: '👑 Réservé aux admins (désolé)' 
      });
    }

    const idea = await IdeaBox.findByIdAndUpdate(
      req.params.id,
      { status, adminComment },
      { new: true }
    ).populate('author', 'username avatar');

    if (!idea) {
      return res.status(404).json({ 
        message: '👻 Idée fantôme détectée' 
      });
    }

    const sarcasticStatusMessages = {
      approved: '✅ Approuvée ! (Miracle)',
      rejected: '❌ Rejetée (on s\'y attendait)',
      implemented: '🎉 Implémentée ! (Non mais sérieux ?)',
      abandoned: '☠️ Abandonnée (RIP little idea)'
    };

    res.json({
      success: true,
      idea,
      message: sarcasticStatusMessages[status] || '📝 Statut mis à jour'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      message: '⚙️ Erreur admin', 
      error: error.message 
    });
  }
};

// @desc    Get statistics
// @route   GET /api/idea-box/stats
// @access  Public
export const getIdeaStats = async (req, res) => {
  try {
    const total = await IdeaBox.countDocuments();
    const byStatus = await IdeaBox.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byCategory = await IdeaBox.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const topIdea = await IdeaBox.find()
      .populate('author', 'username avatar')
      .lean();
    
    const topIdeaWithScore = topIdea.map(idea => ({
      ...idea,
      score: (idea.upvotes?.length || 0) - (idea.downvotes?.length || 0)
    })).sort((a, b) => b.score - a.score)[0];

    res.json({
      success: true,
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byCategory: byCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topIdea: topIdeaWithScore,
      sarcasticNote: '📊 Des stats inutiles pour des idées inutiles... parfait !'
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      message: '📈 Erreur de stats', 
      error: error.message 
    });
  }
};

export default {
  getAllIdeas,
  createIdea,
  voteIdea,
  deleteIdea,
  updateIdeaStatus,
  getIdeaStats
};
