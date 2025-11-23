import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 text-6xl opacity-20"
        >
          💻
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-32 text-5xl opacity-20"
        >
          🎮
        </motion.div>
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 left-40 text-5xl opacity-20"
        >
          🚀
        </motion.div>
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-40 right-20 text-6xl opacity-20"
        >
          💾
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Nos Souvenirs</span>
            <br />
            <span className="text-white">Codés avec ❤️</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
        >
          Un espace pour immortaliser nos{' '}
          <span className="text-primary-400 font-semibold">moments geeks</span>,{' '}
          <span className="text-purple-400 font-semibold">nos fous rires</span>, et{' '}
          <span className="text-pink-400 font-semibold">nos victoires</span> 🎉
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <div className="glass px-6 py-3 rounded-full">
            <span className="text-lg">🤓 Geek-friendly</span>
          </div>
          <div className="glass px-6 py-3 rounded-full">
            <span className="text-lg">😂 100% Fun</span>
          </div>
          <div className="glass px-6 py-3 rounded-full">
            <span className="text-lg">💪 Inspirant</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12"
        >
          <p className="text-gray-400 text-sm italic">
            "Parce que chaque bug résolu mérite d'être célébré 🐛✨"
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
