import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-9xl mb-6"
        >
          404
        </motion.div>

        <h1 className="text-4xl font-bold gradient-text mb-4">
          Oups ! Page introuvable
        </h1>

        <p className="text-xl text-gray-400 mb-8">
          Cette page s'est perdue dans le cyberespace 🚀
        </p>

        <div className="text-6xl mb-8">
          🤔
        </div>

        <Link to="/" className="btn-primary inline-flex items-center space-x-2">
          <Home size={20} />
          <span>Retour à l'accueil</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
