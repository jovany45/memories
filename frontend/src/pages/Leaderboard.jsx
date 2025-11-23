import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { gamificationAPI } from '../api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await gamificationAPI.getLeaderboard(20);
      setLeaderboard(data.leaderboard);
    } catch (error) {
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-400" size={32} />;
      case 2:
        return <Medal className="text-gray-300" size={28} />;
      case 3:
        return <Award className="text-orange-400" size={28} />;
      default:
        return <span className="text-2xl font-bold text-gray-500">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card h-20 bg-gray-700"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Classement Général
          </h1>
          <p className="text-gray-400">
            Les meilleurs contributeurs de la communauté
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <motion.div
              key={entry.user.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1 mt-8' : 'order-3 mt-8'}`}
            >
              <Link to={`/profile/${entry.user.id}`} className="block">
                <div className={`card ${
                  index === 0 ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/20' :
                  index === 1 ? 'border-gray-400/50' :
                  'border-orange-500/50'
                } hover:scale-105 transition-transform`}>
                  <div className="mb-4">{getRankIcon(entry.rank)}</div>
                  <img
                    src={entry.user.avatar}
                    alt={entry.user.username}
                    className={`w-20 h-20 rounded-full mx-auto mb-3 border-4 ${
                      index === 0 ? 'border-yellow-400' :
                      index === 1 ? 'border-gray-400' :
                      'border-orange-400'
                    }`}
                  />
                  <h3 className="font-bold text-white">{entry.user.username}</h3>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <TrendingUp size={16} className="text-primary-400" />
                    <span className="text-2xl font-bold text-primary-400">{entry.karma}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Karma</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {entry.achievements} achievements
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-3">
          {leaderboard.slice(3).map((entry, index) => (
            <motion.div
              key={entry.user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/profile/${entry.user.id}`}>
                <div className="card flex items-center justify-between hover:border-primary-500/50 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <img
                      src={entry.user.avatar}
                      alt={entry.user.username}
                      className="w-12 h-12 rounded-full border-2 border-primary-500"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{entry.user.username}</h3>
                      <p className="text-sm text-gray-400">
                        {entry.stats.memoriesCreated} souvenirs • {entry.achievements} achievements
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={16} className="text-primary-400" />
                      <span className="text-xl font-bold text-primary-400">{entry.karma}</span>
                    </div>
                    <p className="text-xs text-gray-400">Karma</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
