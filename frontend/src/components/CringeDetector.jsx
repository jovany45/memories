import { motion } from 'framer-motion';

const CringeDetector = ({ score, comment, details }) => {
  if (!score || score === 0) return null;

  const getColor = () => {
    if (score <= 2) return 'text-green-400';
    if (score <= 4) return 'text-yellow-400';
    if (score <= 6) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBackground = () => {
    if (score <= 2) return 'bg-green-500/10 border-green-500/30';
    if (score <= 4) return 'bg-yellow-500/10 border-yellow-500/30';
    if (score <= 6) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${getBackground()} border rounded-lg p-4 mb-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">😬</span>
          <div>
            <h4 className="font-semibold text-white">Cringe Detector™</h4>
            <p className="text-sm text-gray-400">Analyse sarcastique activée</p>
          </div>
        </div>
        <div className={`text-3xl font-bold ${getColor()}`}>
          {score}/10
        </div>
      </div>

      <p className="text-gray-300 mb-3">{comment}</p>

      {details && details.length > 0 && (
        <div className="space-y-1">
          {details.map((detail, index) => (
            <p key={index} className="text-sm text-gray-400">
              • {detail}
            </p>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-xs text-gray-500 italic">
          Note: Ce score est généré automatiquement pour le fun. Ne le prends pas trop au sérieux ! 😄
        </p>
      </div>
    </motion.div>
  );
};

export default CringeDetector;
