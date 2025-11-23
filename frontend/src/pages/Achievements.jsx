import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { gamificationAPI } from '../api';
import { AchievementCard } from '../components/Achievement';
import toast from 'react-hot-toast';

const Achievements = () => {
  const { id } = useParams();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [achievementsData, statsData] = await Promise.all([
        gamificationAPI.getUserAchievements(id),
        gamificationAPI.getUserStats(id)
      ]);
      
      setAchievements(achievementsData.achievements);
      setStats(statsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des achievements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
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
            Achievements
          </h1>
          <p className="text-gray-400">
            {unlockedCount} / {achievements.length} débloqués
          </p>
        </div>

        {/* Progress */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Progression</h3>
              <p className="text-gray-400">Continue sur ta lancée !</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-400">{progress.toFixed(0)}%</div>
              <div className="flex items-center space-x-1 text-yellow-400">
                <Trophy size={16} />
                <span>{stats?.karma || 0} Karma</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="space-y-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              🎉 Débloqués ({unlockedCount})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements
                .filter(a => a.unlocked)
                .map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={true}
                    unlockedAt={achievement.unlockedAt}
                  />
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              🔒 À Débloquer ({achievements.length - unlockedCount})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements
                .filter(a => !a.unlocked)
                .map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={false}
                  />
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
