import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, Calendar, Trash2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { memoryAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchMemory();
  }, [id]);

  const fetchMemory = async () => {
    try {
      const data = await memoryAPI.getMemory(id);
      setMemory(data.memory);
    } catch (error) {
      toast.error('Erreur lors du chargement du souvenir');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Connecte-toi pour liker !');
      return;
    }
    try {
      await memoryAPI.toggleLike(id);
      fetchMemory();
    } catch (error) {
      toast.error('Erreur lors du like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      await memoryAPI.addComment(id, comment);
      setComment('');
      fetchMemory();
      toast.success('💬 Commentaire ajouté !');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce souvenir ?')) return;

    try {
      await memoryAPI.deleteMemory(id);
      toast.success('🗑️ Souvenir supprimé');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!memory) return null;

  const isOwner = user?.id === memory.author._id;
  const isLiked = memory.likes.some(like => like._id === user?.id);

  const moodEmojis = {
    funny: '😂',
    emotional: '🥺',
    epic: '🔥',
    geek: '🤓',
    sarcastic: '😏',
    wholesome: '🥰',
    cringe: '😬'
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {memory.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <span className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>{format(new Date(memory.createdAt), 'dd MMMM yyyy', { locale: fr })}</span>
                </span>
                <span className="badge badge-primary">
                  {memory.type}
                </span>
                <span className="text-2xl">{moodEmojis[memory.mood]}</span>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="btn-ghost text-red-400 hover:text-red-300"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          {/* Media */}
          {memory.mediaUrl && (
            <div className="mb-6 rounded-lg overflow-hidden">
              {memory.type === 'video' ? (
                <video
                  src={`http://localhost:5000${memory.mediaUrl}`}
                  controls
                  className="w-full max-h-[600px] object-contain bg-black"
                />
              ) : (
                <img
                  src={`http://localhost:5000${memory.mediaUrl}`}
                  alt={memory.title}
                  className="w-full max-h-[600px] object-contain bg-dark-800"
                />
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            {memory.description}
          </p>

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {memory.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Link
              to={`/profile/${memory.author._id}`}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={memory.author.avatar}
                alt={memory.author.username}
                className="w-12 h-12 rounded-full border-2 border-primary-500"
              />
              <div>
                <p className="font-semibold text-white">{memory.author.username}</p>
                <p className="text-sm text-gray-400">{memory.author.bio}</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 ${
                  isLiked ? 'text-red-500' : 'text-gray-400'
                } hover:text-red-400 transition-colors`}
              >
                <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="font-semibold">{memory.likes.length}</span>
              </button>
              <span className="flex items-center space-x-2 text-gray-400">
                <MessageCircle size={24} />
                <span className="font-semibold">{memory.comments.length}</span>
              </span>
              <span className="flex items-center space-x-2 text-gray-400">
                <Eye size={24} />
                <span className="font-semibold">{memory.viewCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-6">
            💬 Commentaires ({memory.comments.length})
          </h2>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.username}
                  className="w-10 h-10 rounded-full border-2 border-primary-500"
                />
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ajoute un commentaire..."
                    className="input mb-2"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !comment.trim()}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Envoyer</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="glass-dark rounded-lg p-6 mb-6 text-center">
              <p className="text-gray-400 mb-3">
                Connecte-toi pour commenter ! 💬
              </p>
              <Link to="/login" className="btn-primary inline-block">
                Se connecter
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {memory.comments.map((comment) => (
              <div key={comment._id} className="glass-dark rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.username}
                    className="w-10 h-10 rounded-full border-2 border-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-white">
                        {comment.author.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemoryDetail;
