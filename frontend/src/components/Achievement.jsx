import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AchievementBadge = ({ achievement, unlocked, unlockedAt, size = 'normal' }) => {
  const sizeClasses = {
    small: 'w-12 h-12 text-2xl',
    normal: 'w-20 h-20 text-4xl',
    large: 'w-32 h-32 text-6xl'
  };

  return (
    <motion.div
      whileHover={{ scale: unlocked ? 1.1 : 1 }}
      className={`relative ${unlocked ? '' : 'grayscale opacity-40'}`}
    >
      <div
        className={`${sizeClasses[size]} ${
          unlocked
            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
            : 'bg-gray-700'
        } rounded-full flex items-center justify-center border-4 ${
          unlocked ? 'border-yellow-300 shadow-lg shadow-yellow-500/50' : 'border-gray-600'
        } transition-all`}
      >
        <span>{achievement.icon}</span>
      </div>

      {unlocked && size !== 'small' && (
        <div className="absolute -top-2 -right-2">
          <span className="text-2xl">✨</span>
        </div>
      )}

      {unlocked && unlockedAt && size === 'large' && (
        <p className="text-xs text-center text-gray-400 mt-2">
          Débloqué le {format(new Date(unlockedAt), 'dd MMM yyyy', { locale: fr })}
        </p>
      )}
    </motion.div>
  );
};

const AchievementCard = ({ achievement, unlocked, unlockedAt }) => {
  return (
    <div
      className={`card ${
        unlocked
          ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-transparent'
          : 'opacity-60'
      }`}
    >
      <div className="flex items-start space-x-4">
        <AchievementBadge
          achievement={achievement}
          unlocked={unlocked}
          unlockedAt={unlockedAt}
          size="normal"
        />

        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{achievement.name}</h3>
          <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>

          {unlocked && unlockedAt && (
            <p className="text-xs text-yellow-400">
              ✨ Débloqué le {format(new Date(unlockedAt), 'dd MMMM yyyy', { locale: fr })}
            </p>
          )}

          {!unlocked && (
            <p className="text-xs text-gray-500">🔒 Pas encore débloqué</p>
          )}
        </div>

        {achievement.karma && (
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">+{achievement.karma}</div>
            <div className="text-xs text-gray-400">Karma</div>
          </div>
        )}
      </div>
    </div>
  );
};

const AchievementUnlockNotification = ({ achievement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -50 }}
      className="fixed bottom-4 right-4 z-50 glass-dark rounded-xl p-6 border-2 border-yellow-500 shadow-2xl shadow-yellow-500/50 max-w-sm"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          className="text-6xl"
        >
          {achievement.icon}
        </motion.div>

        <div>
          <p className="text-yellow-400 font-bold text-sm mb-1">🎉 Achievement Débloqué !</p>
          <h3 className="text-white font-bold text-lg">{achievement.name}</h3>
          <p className="text-gray-300 text-sm">{achievement.description}</p>
          {achievement.karma && (
            <p className="text-yellow-400 text-sm mt-1">+{achievement.karma} Karma</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { AchievementBadge, AchievementCard, AchievementUnlockNotification };
