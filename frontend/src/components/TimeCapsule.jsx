import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Lock, Unlock, Calendar } from 'lucide-react';

const TimeCapsule = ({ unlockDate, isUnlocked = false, onUnlock }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (isUnlocked) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const unlock = new Date(unlockDate);
      const diff = unlock - now;

      if (diff <= 0) {
        if (onUnlock) onUnlock();
        return null;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, total: diff };
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockDate, isUnlocked, onUnlock]);

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card border-2 border-green-500/50 bg-green-500/10"
      >
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="inline-block mb-4"
          >
            <Unlock className="text-green-400" size={64} />
          </motion.div>
          <h3 className="text-2xl font-bold text-green-400 mb-2">
            🎉 Capsule Déverrouillée !
          </h3>
          <p className="text-gray-400">
            Ce souvenir est maintenant visible par tous
          </p>
        </div>
      </motion.div>
    );
  }

  if (!timeRemaining || timeRemaining.total <= 0) {
    return null;
  }

  const getProgressPercentage = () => {
    const now = new Date();
    const created = new Date(unlockDate) - (timeRemaining.total);
    const total = new Date(unlockDate) - created;
    const elapsed = now - created;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="card border-2 border-blue-500/50 bg-blue-500/10"
    >
      <div className="text-center">
        {/* Animated Lock Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="inline-block mb-4"
        >
          <div className="relative">
            <Lock className="text-blue-400" size={64} />
            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="absolute inset-0 bg-blue-500 rounded-full blur-xl"
            />
          </div>
        </motion.div>

        <h3 className="text-2xl font-bold text-blue-400 mb-2">
          ⏰ Capsule Temporelle
        </h3>
        <p className="text-gray-400 mb-6">
          Ce souvenir se déverrouillera dans...
        </p>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Jours', value: timeRemaining.days },
            { label: 'Heures', value: timeRemaining.hours },
            { label: 'Minutes', value: timeRemaining.minutes },
            { label: 'Secondes', value: timeRemaining.seconds }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-4"
            >
              <motion.div
                key={item.value}
                initial={{ scale: 1.2, color: '#60A5FA' }}
                animate={{ scale: 1, color: '#FFFFFF' }}
                className="text-3xl font-bold text-white mb-1"
              >
                {item.value.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-sm text-gray-400">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
            <span>Progression</span>
            <span>{getProgressPercentage().toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* Unlock Date */}
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <Calendar size={16} />
          <span className="text-sm">
            Déverrouillage : {new Date(unlockDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        {/* Fun Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 bg-gray-800 rounded-lg p-4"
        >
          <p className="text-gray-300 text-sm">
            {timeRemaining.days > 30
              ? '🌙 Un long voyage dans le temps t\'attend...'
              : timeRemaining.days > 7
              ? '⏳ Patience, le moment approche...'
              : timeRemaining.days > 0
              ? '🎯 Plus que quelques jours !'
              : timeRemaining.hours > 1
              ? '⚡ C\'est bientôt l\'heure !'
              : '🚀 Compte à rebours final !'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimeCapsule;
