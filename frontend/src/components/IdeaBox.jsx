import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, ThumbsUp, ThumbsDown, TrendingUp, Clock, 
  Plus, Trash2, Coffee, Wifi, Pizza, Laugh, AlertCircle,
  Trophy, Flame, MessageCircle, X, Check, Crown
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const IdeaBox = () => {
  const { user, isAuthenticated } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'autre',
    isJoke: false
  });

  const categories = [
    { id: '', name: 'Toutes', emoji: '🎯', color: 'purple' },
    { id: 'infrastructure', name: 'Infrastructure', emoji: '🏢', color: 'blue' },
    { id: 'nourriture', name: 'Bouffe', emoji: '🍕', color: 'orange' },
    { id: 'cours', name: 'Cours', emoji: '📚', color: 'green' },
    { id: 'ambiance', name: 'Ambiance', emoji: '🎉', color: 'pink' },
    { id: 'technologie', name: 'Tech', emoji: '💻', color: 'cyan' },
    { id: 'autre', name: 'Autre', emoji: '🤷', color: 'gray' }
  ];

  const sarcasticTitles = [
    "💡 La Boîte à Idées™ (Où les rêves meurent)",
    "🎪 Le Cirque des Propositions Impossibles",
    "🗑️ La Décharge Intellectuelle Officielle",
    "🎭 Le Théâtre de l'Absurde Participatif",
    "☠️ Le Cimetière des Bonnes Intentions"
  ];

  const sarcasticSubtitles = [
    "Parce que se plaindre, c'est déjà faire quelque chose... non ?",
    "Vos idées sont importantes pour nous (promis on rigole pas)",
    "La démocratie participative version procrastination",
    "On écoute tout ! (et on ignore 99%)",
    "Contribuez à améliorer... absolument rien probablement"
  ];

  const [currentTitle] = useState(sarcasticTitles[Math.floor(Math.random() * sarcasticTitles.length)]);
  const [currentSubtitle] = useState(sarcasticSubtitles[Math.floor(Math.random() * sarcasticSubtitles.length)]);

  useEffect(() => {
    fetchIdeas();
    fetchStats();
  }, [sortBy, selectedCategory]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (sortBy) params.append('sort', sortBy);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await axios.get(`${BASE_URL}/api/idea-box?${params}`);
      setIdeas(response.data.ideas);
      
      if (response.data.sarcasticMessage) {
        toast(response.data.sarcasticMessage, { icon: '🎭' });
      }
    } catch (error) {
      toast.error('💥 Échec du chargement (comme d\'hab)');
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/idea-box/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateIdea = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('🚫 Connecte-toi pour polluer... euh contribuer !');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/idea-box`,
        newIdea,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast(response.data.sarcasticMessage, { icon: '🎪', duration: 4000 });
      setIdeas([response.data.idea, ...ideas]);
      setShowModal(false);
      setNewIdea({ title: '', description: '', category: 'autre', isJoke: false });
      fetchStats();
    } catch (error) {
      toast.error('❌ Idée rejetée par le système');
      console.error('Error creating idea:', error);
    }
  };

  const handleVote = async (ideaId, voteType) => {
    if (!isAuthenticated) {
      toast.error('🗳️ Vote réservé aux membres (désolé)');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/idea-box/${ideaId}/vote`,
        { voteType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setIdeas(ideas.map(idea => 
        idea._id === ideaId ? response.data.idea : idea
      ));

      toast(response.data.sarcasticMessage, { icon: '🎯', duration: 2000 });
    } catch (error) {
      toast.error('⚠️ Vote raté');
      console.error('Error voting:', error);
    }
  };

  const handleDelete = async (ideaId) => {
    if (!window.confirm('Supprimer cette idée révolutionnaire ?')) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/api/idea-box/${ideaId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success(response.data.message);
      setIdeas(ideas.filter(idea => idea._id !== ideaId));
      fetchStats();
    } catch (error) {
      toast.error('💣 Échec de la suppression');
      console.error('Error deleting idea:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-300', icon: '⏳' },
      approved: { label: 'Approuvée', color: 'bg-green-500/20 text-green-300', icon: '✅' },
      rejected: { label: 'Rejetée', color: 'bg-red-500/20 text-red-300', icon: '❌' },
      implemented: { label: 'Implémentée !', color: 'bg-purple-500/20 text-purple-300', icon: '🎉' },
      abandoned: { label: 'Abandonnée', color: 'bg-gray-500/20 text-gray-400', icon: '☠️' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  const getUserVote = (idea) => {
    if (!user) return null;
    if (idea.upvotes?.includes(user.id)) return 'up';
    if (idea.downvotes?.includes(user.id)) return 'down';
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header sarcastique */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5
            }}
            className="text-8xl mb-4 inline-block"
          >
            💡
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{currentTitle}</span>
          </h1>

          <p className="text-xl text-gray-400 italic mb-8">
            {currentSubtitle}
          </p>

          {/* Stats sarcastiques */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex flex-wrap justify-center items-center gap-6 text-sm bg-dark-800/50 backdrop-blur-sm px-8 py-4 rounded-full border border-white/5"
            >
              <span className="flex items-center space-x-2">
                <Lightbulb size={16} className="text-yellow-400" />
                <span className="text-gray-300">{stats.total} idées (wow)</span>
              </span>
              <span className="flex items-center space-x-2">
                <Flame size={16} className="text-orange-400" />
                <span className="text-gray-300">
                  {stats.byStatus?.approved || 0} approuvées (miracle)
                </span>
              </span>
              <span className="flex items-center space-x-2">
                <Trophy size={16} className="text-purple-400" />
                <span className="text-gray-300">
                  {stats.byStatus?.implemented || 0} implémentées (LOL)
                </span>
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Filters & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* Sort & Add */}
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="recent">🕐 Récentes</option>
              <option value="popular">🔥 Populaires</option>
              <option value="controversial">⚡ Controversées</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isAuthenticated ? setShowModal(true) : toast.error('🚫 Connecte-toi d\'abord !')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span className="hidden md:inline">Balancer une idée</span>
              <span className="md:hidden">Ajouter</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Lightbulb size={48} className="text-primary-400" />
            </motion.div>
          </div>
        ) : ideas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-dark-800/30 rounded-3xl border border-white/5"
          >
            <span className="text-8xl mb-4 block">🦗</span>
            <h3 className="text-2xl font-bold text-white mb-2">
              Silence radio... C'est louche
            </h3>
            <p className="text-gray-400">
              Soit tout est parfait, soit personne n'ose se plaindre 🤔
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {ideas.map((idea, index) => {
                const userVote = getUserVote(idea);
                const categoryInfo = categories.find(c => c.id === idea.category) || categories[categories.length - 1];

                return (
                  <motion.div
                    key={idea._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="card group relative overflow-hidden"
                  >
                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-2xl">{categoryInfo.emoji}</span>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white pr-8 line-clamp-2">
                          {idea.title}
                        </h3>
                      </div>

                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {idea.description}
                      </p>

                      {/* Status */}
                      {getStatusBadge(idea.status)}

                      {/* Admin comment */}
                      {idea.adminComment && (
                        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <p className="text-sm text-yellow-300 flex items-start space-x-2">
                            <Crown size={16} className="flex-shrink-0 mt-0.5" />
                            <span className="italic">{idea.adminComment}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Author */}
                    <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-white/10">
                      <img
                        src={idea.author?.avatar}
                        alt={idea.author?.username}
                        className="w-8 h-8 rounded-full border-2 border-primary-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300 truncate">{idea.author?.username}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(idea.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    {/* Voting */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVote(idea._id, 'up')}
                          disabled={!isAuthenticated}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                            userVote === 'up'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                          } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
                        >
                          <ThumbsUp size={16} />
                          <span className="font-semibold">{idea.upvotesCount || 0}</span>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVote(idea._id, 'down')}
                          disabled={!isAuthenticated}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                            userVote === 'down'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                          } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
                        >
                          <ThumbsDown size={16} />
                          <span className="font-semibold">{idea.downvotesCount || 0}</span>
                        </motion.button>

                        {/* Score */}
                        <div className={`px-3 py-2 rounded-lg font-bold ${
                          idea.score > 0 ? 'text-green-400' : 
                          idea.score < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {idea.score > 0 && '+'}{idea.score}
                        </div>
                      </div>

                      {/* Delete button (author or admin) */}
                      {isAuthenticated && (idea.author?._id === user?.id || user?.role === 'admin') && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(idea._id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Create Idea Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-800 rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-text">
                    💡 Balance ton idée révolutionnaire
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleCreateIdea} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Titre (sois accrocheur)
                    </label>
                    <input
                      type="text"
                      value={newIdea.title}
                      onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                      className="input w-full"
                      placeholder="Ex: Un jacuzzi dans la salle de pause"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Description (détaille ta vision)
                    </label>
                    <textarea
                      value={newIdea.description}
                      onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                      className="input w-full min-h-[120px]"
                      placeholder="Explique pourquoi c'est LA meilleure idée du siècle..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={newIdea.category}
                      onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                      className="input w-full"
                    >
                      {categories.slice(1).map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isJoke"
                      checked={newIdea.isJoke}
                      onChange={(e) => setNewIdea({ ...newIdea, isJoke: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isJoke" className="text-sm text-gray-400">
                      🤡 C'est juste pour rire (idée troll)
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      <Lightbulb size={20} />
                      <span>Envoyer l'idée</span>
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-ghost"
                    >
                      Annuler
                    </button>
                  </div>
                </form>

                <p className="mt-4 text-xs text-gray-500 italic text-center">
                  ⚠️ Attention : 0,001% de chances que ce soit implémenté
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer sarcastique */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center space-y-2"
        >
          <p className="text-gray-500 text-sm">
            🎭 Cette boîte à idées est 100% démocratique et 0% utile
          </p>
          <p className="text-gray-600 text-xs italic">
            "On prend en compte toutes vos suggestions" - Responsable RH (menteur professionnel)
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default IdeaBox;
