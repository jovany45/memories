import User from '../models/User.js';
import Memory from '../models/Memory.js';
import { checkAchievements, ACHIEVEMENTS } from '../utils/achievements.js';

// @desc    Get leaderboard (Top users by karma)
// @route   GET /api/gamification/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const users = await User.find({ isActive: true })
      .select('username avatar karma achievements stats')
      .sort({ karma: -1 })
      .limit(parseInt(limit));
    
    res.json({
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user._id,
          username: user.username,
          avatar: user.avatar
        },
        karma: user.karma,
        achievements: user.achievements.length,
        stats: user.stats
      }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du classement', error: error.message });
  }
};

// @desc    Get user achievements
// @route   GET /api/gamification/achievements/:userId
// @access  Public
export const getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    
    const memories = await Memory.find({ author: user._id });
    
    // Check for new achievements
    const newAchievements = await checkAchievements(user, memories);
    
    // Get all available achievements with unlock status
    const allAchievements = Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: user.achievements.some(a => a.id === achievement.id),
      unlockedAt: user.achievements.find(a => a.id === achievement.id)?.unlockedAt || null
    }));
    
    res.json({
      achievements: allAchievements,
      newlyUnlocked: newAchievements,
      totalKarma: user.karma
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des achievements', error: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/gamification/stats/:userId
// @access  Public
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    
    const memories = await Memory.find({ author: user._id });
    
    // Calculate various stats
    const totalLikes = memories.reduce((sum, m) => sum + m.likes.length, 0);
    const totalComments = memories.reduce((sum, m) => sum + m.comments.length, 0);
    const totalViews = memories.reduce((sum, m) => sum + m.viewCount, 0);
    const totalReactions = memories.reduce((sum, m) => sum + m.reactions.length, 0);
    
    const moodDistribution = memories.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {});
    
    const typeDistribution = memories.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      karma: user.karma,
      achievements: user.achievements.length,
      stats: user.stats,
      memoriesStats: {
        total: memories.length,
        totalLikes,
        totalComments,
        totalViews,
        totalReactions,
        avgLikesPerMemory: memories.length > 0 ? (totalLikes / memories.length).toFixed(1) : 0,
        moodDistribution,
        typeDistribution
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des stats', error: error.message });
  }
};

export default { getLeaderboard, getUserAchievements, getUserStats };
