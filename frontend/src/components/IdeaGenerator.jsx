import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Lightbulb, Zap, Rocket, Brain, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../api/axios';
import toast from 'react-hot-toast';

const IdeaGenerator = () => {
  const [currentIdea, setCurrentIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const categories = [
    { 
      id: null, 
      name: 'Surprise', 
      emoji: '🎲', 
      color: 'from-purple-500 to-pink-500',
      description: 'Aléatoire' 
    },
    { 
      id: 'normal', 
      name: 'Classique', 
      emoji: '💼', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Vie quotidienne' 
    },
    { 
      id: 'wtf', 
      name: 'WTF Mode', 
      emoji: '🤪', 
      color: 'from-orange-500 to-red-500',
      description: 'Délire total' 
    },
    { 
      id: 'geek', 
      name: 'Geek Zone', 
      emoji: '🎮', 
      color: 'from-green-500 to-emerald-500',
      description: 'Pop culture' 
    }
  ];

  useEffect(() => {
    fetchStats();
    generateIdea();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/features/idea-generator/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateIdea = async (category = selectedCategory) => {
    if (loading) return;
    
    setLoading(true);
    setIsAnimating(true);
    setCopied(false);

    try {
      const url = category 
        ? `${BASE_URL}/api/features/idea-generator?category=${category}`
        : `${BASE_URL}/api/features/idea-generator`;
      
      const response = await axios.get(url);
      
      // Petit délai pour l'animation
      setTimeout(() => {
        setCurrentIdea(response.data);
        setIsAnimating(false);
      }, 500);
      
    } catch (error) {
      toast.error('Erreur lors de la génération');
      console.error('Error generating idea:', error);
      setIsAnimating(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    generateIdea(categoryId);
  };

  const copyToClipboard = () => {
    if (currentIdea) {
      navigator.clipboard.writeText(currentIdea.idea);
      setCopied(true);
      toast.success('💾 Idée copiée !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryInfo = () => {
    return categories.find(cat => cat.id === selectedCategory) || categories[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-8xl mb-4 inline-block"
          >
            💡
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Générateur d'Idées</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-6">
            Plus jamais en panne d'inspiration pour tes publications !
          </p>

          {/* Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-6 text-sm text-gray-500 bg-dark-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/5"
            >
              <span className="flex items-center space-x-2">
                <Sparkles size={16} className="text-yellow-400" />
                <span>{stats.total} idées disponibles</span>
              </span>
              <span className="flex items-center space-x-2">
                <Brain size={16} className="text-purple-400" />
                <span>3 catégories</span>
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id || 'random'}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(category.id)}
              className={`relative group overflow-hidden rounded-2xl p-6 transition-all ${
                selectedCategory === category.id
                  ? 'ring-4 ring-white/30'
                  : 'hover:ring-2 hover:ring-white/20'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="text-4xl mb-2">{category.emoji}</div>
                <div className="font-bold text-lg mb-1">{category.name}</div>
                <div className="text-xs opacity-80">{category.description}</div>
              </div>

              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: selectedCategory === category.id ? '100%' : '-100%' }}
                transition={{ 
                  duration: 1,
                  repeat: selectedCategory === category.id ? Infinity : 0,
                  repeatDelay: 2
                }}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Idea Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          {/* Background Glow */}
          <div className={`absolute -inset-4 bg-gradient-to-r ${getCategoryInfo().color} opacity-20 blur-3xl rounded-3xl`} />

          <div className="relative bg-dark-800/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Animated Border */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${getCategoryInfo().color} opacity-50`}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ 
                backgroundSize: '200% 200%',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                padding: '2px'
              }}
            />

            <div className="relative p-12">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-2 mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <span className="text-2xl">{getCategoryInfo().emoji}</span>
                <span className="text-sm font-semibold text-white/80">{getCategoryInfo().name}</span>
              </motion.div>

              {/* Idea Text */}
              <AnimatePresence mode="wait">
                {isAnimating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-16"
                  >
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                        scale: { duration: 0.5, repeat: Infinity }
                      }}
                    >
                      <Sparkles size={48} className="text-primary-400" />
                    </motion.div>
                  </motion.div>
                ) : currentIdea ? (
                  <motion.div
                    key={currentIdea.idea}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-3xl md:text-4xl font-bold text-white leading-relaxed mb-8">
                      {currentIdea.idea}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => generateIdea()}
                        disabled={loading}
                        className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all ${
                          loading 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : `bg-gradient-to-r ${getCategoryInfo().color} text-white hover:shadow-lg hover:shadow-primary-500/50`
                        }`}
                      >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        <span>Nouvelle Idée</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                      >
                        {copied ? (
                          <>
                            <Check size={20} />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={20} />
                            <span>Copier</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {[
            {
              icon: Lightbulb,
              title: '90 Idées Uniques',
              description: 'Un catalogue complet pour tous les styles',
              color: 'text-yellow-400'
            },
            {
              icon: Zap,
              title: 'Instantané',
              description: 'Génération ultra-rapide en un clic',
              color: 'text-blue-400'
            },
            {
              icon: Rocket,
              title: '100% Original',
              description: 'Des suggestions créées pour 2ISALife',
              color: 'text-purple-400'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all"
            >
              <feature.icon size={32} className={`${feature.color} mb-4`} />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>✨ Appuie sur "Nouvelle Idée" autant de fois que tu veux !</p>
          <p className="mt-2">💡 Astuce : Copie l'idée et personnalise-la à ta sauce</p>
        </motion.div>
      </div>
    </div>
  );
};

export default IdeaGenerator;
