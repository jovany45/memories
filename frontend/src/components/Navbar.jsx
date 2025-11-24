import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Plus, User, LogOut, Menu, X, Trophy, Clock, Sword, Palette, Shield, Lightbulb, MessageSquare, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

  return (
    <nav className="glass-dark border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl group-hover:animate-bounce">💾</span>
            <span className="text-xl font-bold gradient-text">2ISALife</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <Home size={20} />
              <span>Accueil</span>
            </Link>

            <Link to="/timeline" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <Clock size={20} />
              <span>Timeline</span>
            </Link>

            <Link to="/leaderboard" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <Trophy size={20} />
              <span>Classement</span>
            </Link>

            <Link to="/duels" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <Sword size={20} />
              <span>Duels</span>
            </Link>

            <Link to="/idea-generator" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <Lightbulb size={20} />
              <span>Idées</span>
            </Link>

            <Link to="/idea-box" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <MessageSquare size={20} />
              <span>Boîte à Idées</span>
            </Link>

            <Link to="/complaints" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <AlertCircle size={20} />
              <span>Plaintes</span>
            </Link>

            <button
              onClick={() => setShowThemeSwitcher(true)}
              className="flex items-center space-x-2 hover:text-primary-400 transition-colors"
            >
              <Palette size={20} />
              <span>Thème</span>
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-4 py-2 rounded-lg transition-all"
                  >
                    <Shield size={20} />
                    <span className="font-bold">Admin</span>
                  </Link>
                )}
                
                <Link 
                  to="/create" 
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Nouveau Souvenir</span>
                </Link>
                
                <Link 
                  to={`/profile/${user?.id}`}
                  className="flex items-center space-x-2 hover:text-primary-400 transition-colors"
                >
                  <img 
                    src={user?.avatar} 
                    alt={user?.username}
                    className="w-8 h-8 rounded-full border-2 border-primary-500"
                  />
                  <span>{user?.username}</span>
                </Link>

                <button 
                  onClick={logout}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-4"
            >
              <Link 
                to="/" 
                className="block py-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Accueil
              </Link>

              <Link 
                to="/timeline" 
                className="block py-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ⏰ Timeline
              </Link>

              <Link 
                to="/leaderboard" 
                className="block py-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🏆 Classement
              </Link>

              <Link 
                to="/duels" 
                className="block py-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ⚔️ Duels
              </Link>

              <Link 
                to="/idea-generator" 
                className="block py-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                💡 Générateur d'Idées
              </Link>

              <Link 
                to="/idea-box" 
                className="block py-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                💬 Boîte à Idées
              </Link>

              <Link 
                to="/complaints" 
                className="block py-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📢 Plaintes
              </Link>

              <button
                onClick={() => {
                  setShowThemeSwitcher(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-primary-400 transition-colors"
              >
                🎨 Thème
              </button>

              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block py-2 text-yellow-400 hover:text-yellow-300 transition-colors font-bold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👑 Admin Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    to="/create" 
                    className="block py-2 hover:text-primary-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ➕ Nouveau Souvenir
                  </Link>
                  
                  <Link 
                    to={`/profile/${user?.id}`}
                    className="block py-2 hover:text-primary-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Mon Profil
                  </Link>

                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 hover:text-primary-400 transition-colors"
                  >
                    🚪 Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block py-2 hover:text-primary-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔑 Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="block py-2 hover:text-primary-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✨ Inscription
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme Switcher Modal */}
      <ThemeSwitcher 
        isOpen={showThemeSwitcher} 
        onClose={() => setShowThemeSwitcher(false)} 
      />
    </nav>
  );
};

export default Navbar;
