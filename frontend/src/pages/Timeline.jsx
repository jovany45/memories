import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Heart, MessageCircle, GitBranch, Sparkles } from 'lucide-react';
import { memoryAPI } from '../api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BASE_URL } from '../api/axios';

const Timeline = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const data = await memoryAPI.getAllMemories();
      // Sort par date décroissante
      const memoriesArray = data.memories || [];
      const sorted = memoriesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMemories(sorted);
    } catch (error) {
      toast.error('Erreur lors du chargement des souvenirs');
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMemories = () => {
    if (filter === 'all') return memories;
    return memories.filter(m => m.type === filter);
  };

  const getMemoryIcon = (memory) => {
    if (memory.memoryChain) return <GitBranch className="text-purple-400" size={20} />;
    if (memory.isTimeCapsule) return <Clock className="text-blue-400" size={20} />;
    if (memory.contributors && memory.contributors.length > 1) return <Sparkles className="text-yellow-400" size={20} />;
    
    switch (memory.type) {
      case 'photo': return '📷';
      case 'video': return '🎥';
      case 'anecdote': return '📝';
      default: return '💭';
    }
  };

  const groupByMonth = (memories) => {
    const groups = {};
    memories.forEach(memory => {
      const date = new Date(memory.createdAt);
      const monthYear = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(memory);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const filteredMemories = getFilteredMemories();
  const groupedMemories = groupByMonth(filteredMemories);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-4xl font-bold gradient-text mb-4">Timeline Interactive</h1>
          <p className="text-gray-400 mb-8">Voyage dans le temps à travers tes souvenirs</p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {['all', 'photo', 'video', 'anecdote'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-full transition-all ${
                  filter === type
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {type === 'all' ? '📂 Tout' : 
                 type === 'photo' ? '📷 Photos' :
                 type === 'video' ? '🎥 Vidéos' : '📝 Anecdotes'}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-purple-500 to-pink-500"></div>

          {Object.entries(groupedMemories).map(([monthYear, monthMemories], monthIndex) => (
            <div key={monthYear} className="mb-12">
              {/* Month Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: monthIndex * 0.1 }}
                className="flex items-center mb-6"
              >
                <div className="relative z-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full p-3">
                  <Calendar className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-white">{monthYear}</h2>
                  <p className="text-gray-400">{monthMemories.length} souvenir(s)</p>
                </div>
              </motion.div>

              {/* Memories */}
              <div className="space-y-6">
                {monthMemories.map((memory, index) => (
                  <motion.div
                    key={memory._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (monthIndex * 0.1) + (index * 0.05) }}
                    className="ml-20 relative"
                  >
                    {/* Connector */}
                    <div className="absolute -left-12 top-6 w-12 h-0.5 bg-gray-700"></div>
                    <div className="absolute -left-12 top-5 w-3 h-3 rounded-full bg-primary-500 animate-pulse"></div>

                    <Link to={`/memory/${memory._id}`}>
                      <div className="card hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="flex items-start space-x-4">
                          {/* Icon */}
                          <div className="text-3xl flex-shrink-0">
                            {getMemoryIcon(memory)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-white truncate">
                                {memory.title}
                              </h3>
                              <span className="text-sm text-gray-400 flex-shrink-0">
                                {new Date(memory.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            <p className="text-gray-400 mb-3 line-clamp-2">
                              {memory.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="flex items-center space-x-1 text-red-400">
                                <Heart size={16} />
                                <span>{memory.likes?.length || 0}</span>
                              </span>
                              <span className="flex items-center space-x-1 text-blue-400">
                                <MessageCircle size={16} />
                                <span>{memory.comments?.length || 0}</span>
                              </span>
                              {memory.cringeScore > 0 && (
                                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                                  🤪 Cringe: {memory.cringeScore}/10
                                </span>
                              )}
                              {memory.reactions && Object.values(memory.reactions).reduce((a, b) => a + b.length, 0) > 0 && (
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                  ⚡ {Object.values(memory.reactions).reduce((a, b) => a + b.length, 0)} réactions
                                </span>
                              )}
                            </div>

                            {/* Special Badges */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {memory.isTimeCapsule && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                  ⏰ Capsule temporelle
                                </span>
                              )}
                              {memory.memoryChain && (
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                  🔗 Chaîne de souvenirs
                                </span>
                              )}
                              {memory.contributors && memory.contributors.length > 1 && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                  👥 Collaboratif ({memory.contributors.length})
                                </span>
                              )}
                              {memory.voiceNoteUrl && (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                                  🎤 Note vocale
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Thumbnail */}
                          {memory.type !== 'anecdote' && memory.fileUrl && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              {memory.type === 'photo' ? (
                                <img
                                  src={`${BASE_URL}${memory.fileUrl}`}
                                  alt={memory.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={`${BASE_URL}${memory.fileUrl}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤷</div>
            <p className="text-xl text-gray-400">Aucun souvenir trouvé</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Timeline;
