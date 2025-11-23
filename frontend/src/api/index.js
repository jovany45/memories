import api from './axios';

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  updateProfile: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  }
};

export const memoryAPI = {
  getAllMemories: async (params = {}) => {
    const response = await api.get('/memories', { params });
    return response.data;
  },
  
  getMemory: async (memoryId) => {
    const response = await api.get(`/memories/${memoryId}`);
    return response.data;
  },
  
  createMemory: async (formData) => {
    const response = await api.post('/memories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  updateMemory: async (memoryId, data) => {
    const response = await api.put(`/memories/${memoryId}`, data);
    return response.data;
  },
  
  deleteMemory: async (memoryId) => {
    const response = await api.delete(`/memories/${memoryId}`);
    return response.data;
  },
  
  toggleLike: async (memoryId) => {
    const response = await api.post(`/memories/${memoryId}/like`);
    return response.data;
  },
  
  addComment: async (memoryId, content) => {
    const response = await api.post(`/memories/${memoryId}/comments`, { content });
    return response.data;
  },
  
  deleteComment: async (memoryId, commentId) => {
    const response = await api.delete(`/memories/${memoryId}/comments/${commentId}`);
    return response.data;
  },
  
  // Reactions
  addReaction: async (memoryId, type) => {
    const response = await api.post(`/memories/${memoryId}/react`, { type });
    return response.data;
  },
  
  // Code Review
  addReview: async (memoryId, status, comment) => {
    const response = await api.post(`/memories/${memoryId}/review`, { status, comment });
    return response.data;
  },
  
  // Collaborative
  addContributor: async (memoryId, contribution) => {
    const response = await api.post(`/memories/${memoryId}/contribute`, { contribution });
    return response.data;
  },
  
  // Mashup
  createMashup: async (memory1Id, memory2Id) => {
    const response = await api.post('/memories/mashup', { memory1Id, memory2Id });
    return response.data;
  },
  
  // Chain
  chainMemory: async (parentId, childMemoryId) => {
    const response = await api.post(`/memories/${parentId}/chain`, { childMemoryId });
    return response.data;
  },
  
  getMemoryChain: async (memoryId) => {
    const response = await api.get(`/memories/${memoryId}/chain`);
    return response.data;
  }
};

export const gamificationAPI = {
  getLeaderboard: async (limit = 10) => {
    const response = await api.get('/gamification/leaderboard', { params: { limit } });
    return response.data;
  },
  
  getUserAchievements: async (userId) => {
    const response = await api.get(`/gamification/achievements/${userId}`);
    return response.data;
  },
  
  getUserStats: async (userId) => {
    const response = await api.get(`/gamification/stats/${userId}`);
    return response.data;
  }
};

export const featuresAPI = {
  getDailyChallenge: async () => {
    const response = await api.get('/features/daily-challenge');
    return response.data;
  },
  
  completeDailyChallenge: async (memoryId) => {
    const response = await api.post('/features/daily-challenge/complete', { memoryId });
    return response.data;
  },
  
  getActiveDuels: async () => {
    const response = await api.get('/features/duels');
    return response.data;
  },
  
  createDuel: async (memory1Id, memory2Id, title, duration) => {
    const response = await api.post('/features/duels', { memory1Id, memory2Id, title, duration });
    return response.data;
  },
  
  voteInDuel: async (duelId, choice) => {
    const response = await api.post(`/features/duels/${duelId}/vote`, { choice });
    return response.data;
  }
};
