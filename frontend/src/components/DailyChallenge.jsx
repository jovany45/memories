import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users } from 'lucide-react';
import { featuresAPI } from '../api';
import toast from 'react-hot-toast';

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const data = await featuresAPI.getDailyChallenge();
      setChallenge(data.challenge);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-32 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl"
          >
            {challenge.icon}
          </motion.span>
          <div>
            <h3 className="text-xl font-bold gradient-text">Défi du Jour</h3>
            <p className="text-sm text-gray-400">Challenge quotidien</p>
          </div>
        </div>
        <Trophy className="text-yellow-400" size={32} />
      </div>

      <p className="text-lg text-white mb-4">{challenge.challenge}</p>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2 text-gray-400">
          <Users size={20} />
          <span>{challenge.participants?.length || 0} participants</span>
        </div>
        <span className="badge badge-success">+20 Karma</span>
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
