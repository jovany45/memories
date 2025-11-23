import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Heart, MessageCircle } from 'lucide-react';
import { userAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import MemoryCard from '../components/MemoryCard';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const data = await userAPI.getUserProfile(id);
      setProfile(data.user);
      setFormData({
        username: data.user.username,
        bio: data.user.bio
      });
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(id, formData);
      toast.success('✅ Profil mis à jour !');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) return null;

  const isOwnProfile = currentUser?.id === profile._id;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <motion.img
              whileHover={{ scale: 1.05, rotate: 5 }}
              src={profile.avatar}
              alt={profile.username}
              className="w-32 h-32 rounded-full border-4 border-primary-500"
            />

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input"
                    placeholder="Nom d'utilisateur"
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="textarea"
                    placeholder="Bio"
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-ghost"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-3xl font-bold gradient-text mb-2">
                    {profile.username}
                  </h1>
                  <p className="text-gray-400 mb-4 max-w-2xl">
                    {profile.bio}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary"
                    >
                      ✏️ Modifier le profil
                    </button>
                  )}
                </>
              )}

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">
                    {profile.memories?.length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Souvenirs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {profile.memories?.reduce((acc, m) => acc + (m.likesCount || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-400">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {profile.memories?.reduce((acc, m) => acc + (m.commentsCount || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-400">Commentaires</div>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-500 text-sm mt-4">
                <Calendar size={16} />
                <span>
                  Membre depuis {new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Memories Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            📸 Souvenirs partagés
          </h2>

          {profile.memories && profile.memories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.memories.map((memory) => (
                <MemoryCard key={memory._id} memory={memory} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 card"
            >
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-bold text-white mb-2">
                Aucun souvenir pour le moment
              </h3>
              <p className="text-gray-400">
                {isOwnProfile ? 'Commence à partager tes moments !' : 'Reviens plus tard !'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
