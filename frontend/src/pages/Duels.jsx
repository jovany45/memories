import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sword, Trophy, Clock, Users } from 'lucide-react';
import { featuresAPI, memoryAPI } from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../api/axios';

const Duels = () => {
  const [duels, setDuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  useEffect(() => {
    fetchDuels();
  }, []);

  const fetchDuels = async () => {
    try {
      const data = await featuresAPI.getActiveDuels();
      setDuels(data.duels || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des duels');
      setDuels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (duelId, memoryId, duel) => {
    try {
      // Déterminer si c'est memory1 (choice: 1) ou memory2 (choice: 2)
      const choice = duel.memory1._id === memoryId ? 1 : 2;
      
      await featuresAPI.voteInDuel(duelId, choice);
      toast.success('Vote enregistré ! +5 Karma 🎉');
      fetchDuels();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du vote');
    }
  };

  const getVotePercentage = (memory, duel, memIndex) => {
    const totalVotes = duel.votes.length;
    if (totalVotes === 0) return 0;
    
    // memIndex: 0 pour memory1, 1 pour memory2
    const choice = memIndex + 1;
    const memoryVotes = duel.votes.filter(v => v.choice === choice).length;
    return Math.round((memoryVotes / totalVotes) * 100);
  };

  const hasUserVoted = (duel, userId) => {
    return duel.votes.some(v => v.user.toString() === userId);
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Terminé';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      return `${Math.floor(hours / 24)}j restants`;
    }
    return `${hours}h ${minutes}m`;
  };

  const activeDuels = Array.isArray(duels) ? duels.filter(d => d.status === 'active') : [];
  const finishedDuels = Array.isArray(duels) ? duels.filter(d => d.status === 'finished') : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            ⚔️
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-4">Duels de Souvenirs</h1>
          <p className="text-gray-400">Qui remportera la bataille ? Vote pour ton favori !</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 justify-center">
          <button
            onClick={() => setTab('active')}
            className={`px-6 py-3 rounded-lg transition-all ${
              tab === 'active'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sword size={20} />
              <span>En cours ({activeDuels.length})</span>
            </div>
          </button>
          <button
            onClick={() => setTab('finished')}
            className={`px-6 py-3 rounded-lg transition-all ${
              tab === 'finished'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Trophy size={20} />
              <span>Terminés ({finishedDuels.length})</span>
            </div>
          </button>
        </div>

        {/* Duels List */}
        <div className="space-y-8">
          {(tab === 'active' ? activeDuels : finishedDuels).map((duel, index) => {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const userVoted = hasUserVoted(duel, currentUser._id);
            const isActive = duel.status === 'active';

            return (
              <motion.div
                key={duel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                {/* Duel Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2">
                      <Sword className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Duel #{index + 1}</h3>
                      <p className="text-sm text-gray-400">
                        {duel.votes.length} vote(s)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isActive ? (
                      <div className="flex items-center space-x-2 text-green-400">
                        <Clock size={16} />
                        <span className="text-sm">{getTimeRemaining(duel.endDate)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Trophy size={16} />
                        <span className="text-sm">Terminé</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dueling Memories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[duel.memory1, duel.memory2].map((memory, memIndex) => {
                    const percentage = getVotePercentage(memory, duel, memIndex);
                    const isWinner = !isActive && percentage > 50;

                    return (
                      <div
                        key={memory._id}
                        className={`relative rounded-lg overflow-hidden ${
                          isWinner ? 'ring-2 ring-yellow-400' : ''
                        }`}
                      >
                        {isWinner && (
                          <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                            👑 Gagnant !
                          </div>
                        )}

                        <Link to={`/memory/${memory._id}`}>
                          <div className="bg-gray-800 p-4 h-full hover:bg-gray-750 transition-colors">
                            {/* Memory Preview */}
                            {memory.type !== 'anecdote' && memory.fileUrl && (
                              <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
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

                            {/* Memory Info */}
                            <h4 className="text-white font-bold mb-2 truncate">{memory.title}</h4>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{memory.description}</p>

                            {/* Stats */}
                            <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
                              <span>❤️ {memory.likes?.length || 0}</span>
                              <span>💬 {memory.comments?.length || 0}</span>
                            </div>

                            {/* Vote Button/Results */}
                            {isActive && !userVoted ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleVote(duel._id, memory._id, duel);
                                }}
                                className="w-full bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]"
                              >
                                🗳️ Voter pour celui-ci
                              </button>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white font-bold">{percentage}%</span>
                                  <span className="text-gray-400 text-sm">
                                    {duel.votes.filter(v => v.choice === (memIndex + 1)).length} vote(s)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className={`h-full ${
                                      isWinner 
                                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                                        : 'bg-gradient-to-r from-primary-500 to-purple-500'
                                    }`}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* VS Divider */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                  VS
                </div>
              </motion.div>
            );
          })}
        </div>

        {(tab === 'active' ? activeDuels : finishedDuels).length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤷</div>
            <p className="text-xl text-gray-400">
              {tab === 'active' ? 'Aucun duel en cours' : 'Aucun duel terminé'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Duels;
