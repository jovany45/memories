import { useState } from 'react';
import { motion } from 'framer-motion';
import { memoryAPI } from '../api';
import toast from 'react-hot-toast';

const reactions = [
  { type: 'thumbsup', emoji: '👍', label: 'Super' },
  { type: 'thumbsdown', emoji: '👎', label: 'Bof' },
  { type: 'laugh', emoji: '😂', label: 'MDR' },
  { type: 'party', emoji: '🎉', label: 'Génial' },
  { type: 'confused', emoji: '😕', label: 'Confus' },
  { type: 'heart', emoji: '❤️', label: 'J\'adore' },
  { type: 'rocket', emoji: '🚀', label: 'Wow' },
  { type: 'eyes', emoji: '👀', label: 'Intéressant' }
];

const ReactionPicker = ({ memoryId, currentReactions, onReactionAdded }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleReact = async (type) => {
    try {
      const data = await memoryAPI.addReaction(memoryId, type);
      toast.success('Réaction ajoutée !');
      setShowPicker(false);
      if (onReactionAdded) onReactionAdded(data.reactions);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la réaction');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="btn-ghost text-sm flex items-center space-x-2"
      >
        <span>😊</span>
        <span>Réagir</span>
      </button>

      {showPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-0 mb-2 glass-dark rounded-lg p-3 shadow-xl z-50"
        >
          <div className="grid grid-cols-4 gap-2">
            {reactions.map((reaction) => (
              <motion.button
                key={reaction.type}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReact(reaction.type)}
                className="text-2xl hover:bg-white/10 rounded-lg p-2 transition-colors"
                title={reaction.label}
              >
                {reaction.emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Display reaction counts */}
      {currentReactions && Object.keys(currentReactions).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(currentReactions).map(([type, count]) => {
            const reaction = reactions.find(r => r.type === type);
            return (
              <span
                key={type}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-500/20 rounded-full text-sm"
              >
                <span>{reaction?.emoji}</span>
                <span>{count}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;
