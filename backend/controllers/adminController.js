import User from '../models/User.js';
import Memory from '../models/Memory.js';
import DailyChallenge from '../models/DailyChallenge.js';
import MemoryDuel from '../models/MemoryDuel.js';
import bcrypt from 'bcryptjs';

// 📊 Statistiques globales du site
export const getGlobalStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalMemories,
      totalComments,
      totalLikes,
      totalKarma
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Memory.countDocuments(),
      Memory.aggregate([
        { $project: { commentCount: { $size: '$comments' } } },
        { $group: { _id: null, total: { $sum: '$commentCount' } } }
      ]),
      Memory.aggregate([
        { $project: { likeCount: { $size: '$likes' } } },
        { $group: { _id: null, total: { $sum: '$likeCount' } } }
      ]),
      User.aggregate([
        { $group: { _id: null, total: { $sum: '$karma' } } }
      ])
    ]);

    // Stats par type de souvenir
    const memoriesByType = await Memory.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Stats par mood
    const memoriesByMood = await Memory.aggregate([
      { $group: { _id: '$mood', count: { $sum: 1 } } }
    ]);

    // Top 5 utilisateurs par karma
    const topUsers = await User.find()
      .sort({ karma: -1 })
      .limit(5)
      .select('username email karma achievements');

    // Activité récente (derniers 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await Memory.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const newUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalMemories,
        totalComments: totalComments[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
        totalKarma: totalKarma[0]?.total || 0
      },
      distribution: {
        memoriesByType,
        memoriesByMood
      },
      topUsers,
      recentActivity: {
        newMemories: recentActivity,
        newUsers
      }
    });
  } catch (error) {
    console.error('Erreur stats globales:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 👥 Liste tous les utilisateurs avec filtres
export const getAllUsers = async (req, res) => {
  try {
    console.log('📋 getAllUsers - Paramètres:', req.query);
    
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      role = '', 
      isActive = '' 
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    console.log('🔍 Query MongoDB:', query);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    console.log(`✅ ${users.length} utilisateurs trouvés sur ${total}`);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('❌ Erreur liste users:', error);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: error.message 
    });
  }
};

// 👤 Détails d'un utilisateur
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('memories', 'title type likes comments createdAt');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Stats supplémentaires
    const totalLikes = await Memory.aggregate([
      { $match: { author: user._id } },
      { $project: { likeCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likeCount' } } }
    ]);

    const totalComments = await Memory.aggregate([
      { $match: { author: user._id } },
      { $project: { commentCount: { $size: '$comments' } } },
      { $group: { _id: null, total: { $sum: '$commentCount' } } }
    ]);

    res.json({
      user,
      stats: {
        totalLikes: totalLikes[0]?.total || 0,
        totalComments: totalComments[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Erreur détails user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔄 Promouvoir/Rétrograder un utilisateur (admin ⟷ user)
export const toggleUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Toggle role
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    console.log(`🔐 ${req.user.username} a changé le rôle de ${user.username} en ${user.role}`);

    res.json({
      message: `✅ ${user.username} est maintenant ${user.role === 'admin' ? 'administrateur' : 'utilisateur'}`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur toggle role:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔒 Activer/Désactiver un compte utilisateur
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Ne pas permettre de se désactiver soi-même
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: '❌ Vous ne pouvez pas désactiver votre propre compte' 
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    console.log(`🔐 ${req.user.username} a ${user.isActive ? 'activé' : 'désactivé'} le compte de ${user.username}`);

    res.json({
      message: `✅ Compte ${user.isActive ? 'activé' : 'désactivé'}`,
      user: {
        _id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Erreur toggle status:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✏️ Modifier les infos d'un utilisateur
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, bio, karma } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mise à jour des champs
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (karma !== undefined) user.karma = karma;

    await user.save();

    console.log(`🔐 ${req.user.username} a modifié le profil de ${user.username}`);

    res.json({
      message: '✅ Profil mis à jour',
      user
    });
  } catch (error) {
    console.error('Erreur update user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🗑️ Supprimer un utilisateur et tous ses souvenirs
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Ne pas permettre de se supprimer soi-même
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: '❌ Vous ne pouvez pas supprimer votre propre compte' 
      });
    }

    // Supprimer tous les souvenirs de l'utilisateur
    await Memory.deleteMany({ author: id });

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(id);

    console.log(`🔐 ${req.user.username} a supprimé le compte de ${user.username}`);

    res.json({
      message: '✅ Utilisateur et ses souvenirs supprimés'
    });
  } catch (error) {
    console.error('Erreur delete user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 📝 Liste tous les souvenirs avec filtres
export const getAllMemories = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      type = '',
      reported = false 
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    // Si on veut les signalements (future feature)
    if (reported === 'true') {
      query.reported = true;
    }

    const memories = await Memory.find(query)
      .populate('author', 'username email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Memory.countDocuments(query);

    res.json({
      memories,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erreur liste memories:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🗑️ Supprimer un souvenir
export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: 'Souvenir non trouvé' });
    }

    // Retirer le souvenir de la liste de l'auteur
    await User.findByIdAndUpdate(memory.author, {
      $pull: { memories: memory._id }
    });

    console.log(`🔐 ${req.user.username} a supprimé le souvenir "${memory.title}"`);

    res.json({
      message: '✅ Souvenir supprimé'
    });
  } catch (error) {
    console.error('Erreur delete memory:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 📊 Logs d'activité (dernières actions)
export const getActivityLogs = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Récupérer les derniers souvenirs, commentaires, likes
    const recentMemories = await Memory.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title type author createdAt');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('username email createdAt');

    // Formater les logs
    const logs = [
      ...recentMemories.map(m => ({
        type: 'memory_created',
        user: m.author?.username || 'Inconnu',
        action: `a créé le souvenir "${m.title}"`,
        timestamp: m.createdAt,
        icon: m.type === 'photo' ? '📷' : m.type === 'video' ? '🎥' : '📝'
      })),
      ...recentUsers.map(u => ({
        type: 'user_registered',
        user: u.username,
        action: 's\'est inscrit',
        timestamp: u.createdAt,
        icon: '👤'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json({ logs });
  } catch (error) {
    console.error('Erreur activity logs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔧 Réinitialiser le mot de passe d'un utilisateur
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`🔐 ${req.user.username} a réinitialisé le mot de passe de ${user.username}`);

    res.json({
      message: '✅ Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    console.error('Erreur reset password:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
