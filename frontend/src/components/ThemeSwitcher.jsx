import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = ({ isOpen, onClose }) => {
  const { theme, setTheme, themes } = useTheme();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎨</div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Choisir un Thème</h2>
          <p className="text-gray-400">Personnalise l'ambiance de ton espace</p>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(themes).map(([key, themeData]) => {
            const isActive = theme === key;

            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme(key)}
                className={`relative cursor-pointer rounded-xl overflow-hidden ${
                  isActive ? 'ring-4 ring-primary-500' : ''
                }`}
              >
                {/* Active Badge */}
                {isActive && (
                  <div className="absolute top-4 right-4 z-10 bg-primary-500 text-white rounded-full p-2">
                    <Check size={20} />
                  </div>
                )}

                {/* Theme Preview */}
                <div 
                  className="h-32 relative"
                  style={{
                    background: themeData.preview?.gradient || 
                      `linear-gradient(135deg, ${themeData.primary} 0%, ${themeData.secondary} 100%)`
                  }}
                >
                  {/* Preview Elements */}
                  <div className="absolute inset-0 p-4 flex items-center justify-center space-x-2">
                    <div 
                      className="w-12 h-12 rounded-lg shadow-lg"
                      style={{ backgroundColor: themeData.primary }}
                    />
                    <div 
                      className="w-12 h-12 rounded-lg shadow-lg"
                      style={{ backgroundColor: themeData.secondary }}
                    />
                    <div 
                      className="w-12 h-12 rounded-lg shadow-lg"
                      style={{ backgroundColor: themeData.accent }}
                    />
                  </div>
                </div>

                {/* Theme Info */}
                <div className="bg-gray-800 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{themeData.icon}</span>
                    <h3 className="text-lg font-bold text-white">{themeData.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{themeData.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSwitcher;
