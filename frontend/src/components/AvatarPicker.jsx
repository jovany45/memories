import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userAPI } from '../api';

const AvatarPicker = ({ currentAvatar, userId, onAvatarUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [avatarStyles, setAvatarStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(currentAvatar);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadAvatarStyles();
  }, []);

  const loadAvatarStyles = async () => {
    try {
      const data = await userAPI.getAvatarStyles();
      setAvatarStyles(data.styles);
    } catch (error) {
      console.error('Erreur lors du chargement des styles:', error);
    }
  };

  const handleGenerateRandom = async () => {
    setIsGenerating(true);
    try {
      const data = await userAPI.generateRandomAvatar(userId);
      setPreviewAvatar(data.avatar);
      onAvatarUpdate(data.avatar);
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style.id);
    // Générer un avatar avec ce style et un seed aléatoire
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/${style.id}/svg?seed=${randomSeed}`;
    setPreviewAvatar(newAvatar);
  };

  const handleConfirmStyle = async () => {
    setIsGenerating(true);
    try {
      // Mettre à jour le profil avec le nouvel avatar
      await userAPI.updateProfile(userId, { avatar: previewAvatar });
      onAvatarUpdate(previewAvatar);
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <motion.img
          src={currentAvatar}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
        />
        <motion.button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✨ Changer d'avatar
        </motion.button>
      </div>

      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Personnaliser ton avatar
            </h3>

            {/* Aperçu */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <img
                src={previewAvatar}
                alt="Aperçu"
                className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-lg"
              />
              <motion.button
                onClick={handleGenerateRandom}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isGenerating ? '⏳ Génération...' : '🎲 Générer un avatar aléatoire'}
              </motion.button>
            </div>

            {/* Sélection du style */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Ou choisis un style :
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {avatarStyles.map((style) => (
                  <motion.button
                    key={style.id}
                    onClick={() => handleStyleSelect(style)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedStyle === style.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl mb-2">{style.name.split(' ')[0]}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {style.name.split(' ').slice(1).join(' ')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {style.description}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedStyle && (
                <motion.button
                  onClick={handleConfirmStyle}
                  disabled={isGenerating}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? '⏳ Sauvegarde...' : '✓ Valider ce style'}
                </motion.button>
              )}
              <motion.button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Annuler
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default AvatarPicker;
