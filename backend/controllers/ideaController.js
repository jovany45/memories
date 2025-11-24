import { getRandomIdea, getMultipleIdeas as getMultipleIdeasUtil, getIdeaStats } from '../utils/ideaGenerator.js';

// @desc    Get a random idea
// @route   GET /api/features/idea-generator
// @access  Public
export const getRandomPublicationIdea = async (req, res) => {
  try {
    const { category } = req.query; // normal, wtf, geek, ou null pour aléatoire
    
    const result = getRandomIdea(category);
    
    res.json({
      success: true,
      ...result,
      emoji: getCategoryEmoji(result.category)
    });
  } catch (error) {
    console.error('Get random idea error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la génération d\'idée', 
      error: error.message 
    });
  }
};

// @desc    Get multiple random ideas
// @route   GET /api/features/idea-generator/multiple
// @access  Public
export const getMultipleIdeas = async (req, res) => {
  try {
    const { count = 5, category } = req.query;
    
    const ideas = getMultipleIdeasUtil(parseInt(count), category);
    
    res.json({
      success: true,
      count: ideas.length,
      ideas: ideas.map(item => ({
        ...item,
        emoji: getCategoryEmoji(item.category)
      }))
    });
  } catch (error) {
    console.error('Get multiple ideas error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la génération d\'idées', 
      error: error.message 
    });
  }
};

// @desc    Get ideas statistics
// @route   GET /api/features/idea-generator/stats
// @access  Public
export const getIdeasStats = async (req, res) => {
  try {
    const stats = getIdeaStats();
    
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    console.error('Get ideas stats error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques', 
      error: error.message 
    });
  }
};

// Helper function
const getCategoryEmoji = (category) => {
  const emojis = {
    normal: '💼',
    wtf: '🤪',
    geek: '🎮'
  };
  return emojis[category] || '✨';
};

export default {
  getRandomPublicationIdea,
  getMultipleIdeas,
  getIdeasStats
};
