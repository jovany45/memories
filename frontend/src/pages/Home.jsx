import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import Hero from '../components/Hero';
import MemoryCard from '../components/MemoryCard';
import { memoryAPI } from '../api';
import toast from 'react-hot-toast';

const Home = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    mood: '',
    search: ''
  });

  useEffect(() => {
    fetchMemories();
  }, [filters]);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const data = await memoryAPI.getAllMemories(filters);
      setMemories(data.memories);
    } catch (error) {
      toast.error('Erreur lors du chargement des souvenirs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="glass-dark rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Filter size={24} className="text-primary-400" />
            <h2 className="text-xl font-semibold">Filtrer les souvenirs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input"
            >
              <option value="">Tous les types</option>
              <option value="photo">📸 Photos</option>
              <option value="video">🎥 Vidéos</option>
              <option value="anecdote">📝 Anecdotes</option>
              <option value="moment">⭐ Moments</option>
            </select>

            {/* Mood Filter */}
            <select
              value={filters.mood}
              onChange={(e) => handleFilterChange('mood', e.target.value)}
              className="input"
            >
              <option value="">Toutes les vibes</option>
              <option value="funny">😂 Drôle</option>
              <option value="emotional">🥺 Émouvant</option>
              <option value="epic">🔥 Épique</option>
              <option value="geek">🤓 Geek</option>
              <option value="sarcastic">😏 Sarcastique</option>
              <option value="wholesome">🥰 Wholesome</option>
              <option value="cringe">😬 Cringe</option>
            </select>

            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Memories Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Chargement des souvenirs...</p>
            </div>
          </div>
        ) : memories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <span className="text-8xl mb-4 block">🤔</span>
            <h3 className="text-2xl font-bold text-white mb-2">
              Aucun souvenir trouvé
            </h3>
            <p className="text-gray-400">
              Soyez le premier à partager un souvenir !
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {memories.map((memory, index) => (
              <motion.div
                key={memory._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MemoryCard memory={memory} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
