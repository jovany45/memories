// Achievement definitions
export const ACHIEVEMENTS = {
  BUG_HUNTER: {
    id: 'bug_hunter',
    name: 'Bug Hunter',
    icon: '🏆',
    description: 'Partager 10 anecdotes sur des bugs',
    requirement: (user, memories) => {
      const bugMemories = memories.filter(m => 
        m.tags.includes('bug') || 
        m.description.toLowerCase().includes('bug') ||
        m.title.toLowerCase().includes('bug')
      );
      return bugMemories.length >= 10;
    },
    karma: 100
  },
  
  PROFESSOR_CODE: {
    id: 'professor_code',
    name: 'Professor Code',
    icon: '🎓',
    description: 'Partager 5 tutoriels ou moments d\'apprentissage',
    requirement: (user, memories) => {
      const tutorialMemories = memories.filter(m =>
        m.tags.includes('tutoriel') ||
        m.tags.includes('apprentissage') ||
        m.type === 'anecdote'
      );
      return tutorialMemories.length >= 5;
    },
    karma: 75
  },
  
  STREAK_MASTER: {
    id: 'streak_master',
    name: 'Streak Master',
    icon: '🔥',
    description: '7 jours consécutifs de partage',
    requirement: (user) => user.stats.consecutiveDays >= 7,
    karma: 150
  },
  
  DATA_HOARDER: {
    id: 'data_hoarder',
    name: 'Data Hoarder',
    icon: '💾',
    description: 'Créer 100 souvenirs',
    requirement: (user) => user.stats.memoriesCreated >= 100,
    karma: 200
  },
  
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    icon: '🤝',
    description: 'Laisser 50 commentaires',
    requirement: (user) => user.stats.commentsGiven >= 50,
    karma: 120
  },
  
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'Premiers Pas',
    icon: '👶',
    description: 'Créer ton premier souvenir',
    requirement: (user) => user.stats.memoriesCreated >= 1,
    karma: 10
  },
  
  POPULAR: {
    id: 'popular',
    name: 'Populaire',
    icon: '⭐',
    description: 'Recevoir 100 likes',
    requirement: (user) => user.stats.likesReceived >= 100,
    karma: 150
  },
  
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Lève-tôt',
    icon: '🌅',
    description: 'Partager un souvenir avant 8h du matin',
    requirement: (user, memories) => {
      return memories.some(m => {
        const hour = new Date(m.createdAt).getHours();
        return hour < 8;
      });
    },
    karma: 25
  },
  
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Oiseau de Nuit',
    icon: '🦉',
    description: 'Partager un souvenir après minuit',
    requirement: (user, memories) => {
      return memories.some(m => {
        const hour = new Date(m.createdAt).getHours();
        return hour >= 0 && hour < 5;
      });
    },
    karma: 25
  },
  
  EMOTION_MASTER: {
    id: 'emotion_master',
    name: 'Maître des Émotions',
    icon: '🎭',
    description: 'Utiliser tous les types de mood',
    requirement: (user, memories) => {
      const moods = new Set(memories.map(m => m.mood));
      return moods.size >= 7;
    },
    karma: 80
  }
};

// Calculate karma for actions
export const KARMA_ACTIONS = {
  CREATE_MEMORY: 10,
  RECEIVE_LIKE: 2,
  RECEIVE_COMMENT: 5,
  GIVE_COMMENT: 3,
  COMPLETE_CHALLENGE: 20,
  WIN_DUEL: 30,
  REVIEW_APPROVED: 15,
  COLLABORATE: 25
};

// Check and award achievements
export const checkAchievements = async (user, memories) => {
  const newAchievements = [];
  
  for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
    // Check if user already has this achievement
    const hasAchievement = user.achievements.some(a => a.id === achievement.id);
    
    if (!hasAchievement && achievement.requirement(user, memories)) {
      const newAchievement = {
        id: achievement.id,
        name: achievement.name,
        icon: achievement.icon,
        description: achievement.description,
        unlockedAt: new Date()
      };
      
      user.achievements.push(newAchievement);
      user.karma += achievement.karma;
      newAchievements.push(newAchievement);
    }
  }
  
  if (newAchievements.length > 0) {
    await user.save();
  }
  
  return newAchievements;
};

// Update user stats
export const updateUserStats = async (user, action) => {
  switch (action) {
    case 'CREATE_MEMORY':
      user.stats.memoriesCreated += 1;
      user.karma += KARMA_ACTIONS.CREATE_MEMORY;
      break;
    case 'GIVE_COMMENT':
      user.stats.commentsGiven += 1;
      user.karma += KARMA_ACTIONS.GIVE_COMMENT;
      break;
    case 'RECEIVE_LIKE':
      user.stats.likesReceived += 1;
      user.karma += KARMA_ACTIONS.RECEIVE_LIKE;
      break;
    case 'RECEIVE_COMMENT':
      user.karma += KARMA_ACTIONS.RECEIVE_COMMENT;
      break;
    default:
      break;
  }
  
  // Update consecutive days
  const today = new Date().setHours(0, 0, 0, 0);
  const lastActive = user.stats.lastActiveDate ? 
    new Date(user.stats.lastActiveDate).setHours(0, 0, 0, 0) : null;
  
  if (!lastActive || today > lastActive) {
    const oneDayAgo = today - (24 * 60 * 60 * 1000);
    if (lastActive === oneDayAgo) {
      user.stats.consecutiveDays += 1;
    } else if (!lastActive || lastActive < oneDayAgo) {
      user.stats.consecutiveDays = 1;
    }
    user.stats.lastActiveDate = new Date();
  }
  
  await user.save();
};
