import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../api';

const ComplaintBox = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComplaint, setNewComplaint] = useState({ content: '', category: 'autre' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Titres sarcastiques rotatifs
  const sarcasticTitles = [
    "📢 Le Livre des Doléances 2.0",
    "🗣️ Criez dans le Vide™",
    "😤 Plaintes Anonymes & Désespérées",
    "📋 Le Registre des Mécontentements",
    "🎭 Le Théâtre des Réclamations"
  ];

  const [currentTitle] = useState(
    sarcasticTitles[Math.floor(Math.random() * sarcasticTitles.length)]
  );

  const categories = [
    { value: 'all', label: 'Toutes', icon: '📋' },
    { value: 'vie_quotidienne', label: 'Vie Quotidienne', icon: '🏠' },
    { value: 'nourriture', label: 'Nourriture', icon: '🍔' },
    { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { value: 'administration', label: 'Administration', icon: '📝' },
    { value: 'relations', label: 'Relations', icon: '👥' },
    { value: 'autre', label: 'Autre', icon: '🤷' }
  ];

  const statusConfig = {
    pending: { label: 'En attente', icon: Clock, color: 'text-yellow-400' },
    acknowledged: { label: 'Pris en compte', icon: Eye, color: 'text-blue-400' },
    in_progress: { label: 'En cours', icon: TrendingUp, color: 'text-purple-400' },
    resolved: { label: 'Résolu', icon: CheckCircle, color: 'text-green-400' },
    rejected: { label: 'Rejeté', icon: XCircle, color: 'text-red-400' },
    ignored: { label: 'Ignoré', icon: EyeOff, color: 'text-gray-500' }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await complaintAPI.getComplaints();
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Erreur lors du chargement des plaintes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    
    if (!newComplaint.content.trim()) {
      toast.error('La plainte ne peut pas être vide !');
      return;
    }

    try {
      const data = await complaintAPI.createComplaint(newComplaint);
      toast.success(data.message);
      setNewComplaint({ content: '', category: 'autre' });
      fetchComplaints();
    } catch (error) {
      console.error('Error creating complaint:', error);
      toast.error('Erreur lors de la création de la plainte');
    }
  };

  const handleVote = async (complaintId, voteType) => {
    if (!user) {
      toast.error('Connecte-toi pour voter !');
      return;
    }

    try {
      const data = await complaintAPI.voteComplaint(complaintId, voteType);
      toast.success(data.message);
      fetchComplaints();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Erreur lors du vote');
    }
  };

  const handleAddComment = async (complaintId) => {
    if (!user) {
      toast.error('Connecte-toi pour commenter !');
      return;
    }

    const content = commentInputs[complaintId]?.trim();
    if (!content) {
      toast.error('Le commentaire ne peut pas être vide !');
      return;
    }

    try {
      const data = await complaintAPI.addComment(complaintId, content);
      toast.success(data.message);
      setCommentInputs({ ...commentInputs, [complaintId]: '' });
      fetchComplaints();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  const toggleComments = (complaintId) => {
    setExpandedComments({
      ...expandedComments,
      [complaintId]: !expandedComments[complaintId]
    });
  };

  const filteredComplaints = selectedCategory === 'all'
    ? complaints
    : complaints.filter(c => c.category === selectedCategory);

  const sortedComplaints = [...filteredComplaints].sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          📢
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            {currentTitle}
          </h1>
          <p className="text-gray-400 text-lg">
            Exprime-toi sur la vie quotidienne au centre 2ISA 🏢
          </p>
          <p className="text-gray-500 text-sm mt-2">
            📍 Cet espace concerne <span className="text-orange-400 font-semibold">la vie au centre de formation 2ISA</span> (infrastructures, services, organisation, etc.)
          </p>
          <p className="text-gray-500 text-sm mt-1">
            ⚠️ Les plaintes sont <span className="text-primary-400 font-semibold">100% anonymes</span>. 
            Ose dire ce que tu penses vraiment !
          </p>
        </motion.div>

        {/* Formulaire de création */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-lighter/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-gray-800/50"
        >
          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={newComplaint.category}
                onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.filter(c => c.value !== 'all').map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ta plainte (anonyme)
              </label>
              <textarea
                value={newComplaint.content}
                onChange={(e) => setNewComplaint({ ...newComplaint, content: e.target.value })}
                placeholder="Exprime ton mécontentement sur la vie au centre 2ISA (nourriture, locaux, organisation, services...)... personne ne saura que c'est toi ! 😈"
                rows={4}
                className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 !text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Envoyer ma plainte dans le vide
            </button>
          </form>
        </motion.div>

        {/* Filtres */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                  : 'bg-dark-lighter/50 text-gray-400 hover:text-white'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Liste des plaintes */}
        <AnimatePresence mode="popLayout">
          {sortedComplaints.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <AlertCircle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                {selectedCategory === 'all' 
                  ? "Aucune plainte sur la vie au centre 2ISA... Tout va bien ou personne n'ose parler ? 🤐"
                  : "Aucune plainte dans cette catégorie concernant le centre. Pour l'instant... 👀"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {sortedComplaints.map((complaint, index) => {
                const StatusIcon = statusConfig[complaint.status]?.icon || Clock;
                const statusColor = statusConfig[complaint.status]?.color || 'text-gray-400';
                const hasUserVoted = user && (
                  complaint.upvotes?.includes(user._id) || 
                  complaint.downvotes?.includes(user._id)
                );

                return (
                  <motion.div
                    key={complaint._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-dark-lighter/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300"
                  >
                    {/* En-tête */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {categories.find(c => c.value === complaint.category)?.icon || '🤷'}
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(complaint.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                            <span className={`text-xs font-medium ${statusColor}`}>
                              {statusConfig[complaint.status]?.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-2 bg-dark/50 px-3 py-1 rounded-lg">
                        <TrendingUp className={`w-4 h-4 ${complaint.score > 0 ? 'text-green-400' : complaint.score < 0 ? 'text-red-400' : 'text-gray-400'}`} />
                        <span className={`font-bold ${complaint.score > 0 ? 'text-green-400' : complaint.score < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                          {complaint.score > 0 ? '+' : ''}{complaint.score}
                        </span>
                      </div>
                    </div>

                    {/* Contenu */}
                    <p className="text-gray-200 mb-4 leading-relaxed">
                      {complaint.content}
                    </p>

                    {/* Commentaire admin */}
                    {complaint.adminComment && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                        <p className="text-xs text-blue-400 font-semibold mb-1">💼 Réponse officielle :</p>
                        <p className="text-sm text-blue-300">{complaint.adminComment}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                      <button
                        onClick={() => handleVote(complaint._id, 'upvote')}
                        disabled={!user}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                          user && complaint.upvotes?.includes(user._id)
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-dark/50 text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{complaint.upvotes?.length || 0}</span>
                      </button>

                      <button
                        onClick={() => handleVote(complaint._id, 'downvote')}
                        disabled={!user}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                          user && complaint.downvotes?.includes(user._id)
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-dark/50 text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm font-medium">{complaint.downvotes?.length || 0}</span>
                      </button>

                      <button
                        onClick={() => toggleComments(complaint._id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark/50 text-gray-400 hover:text-primary-400 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">{complaint.comments?.length || 0}</span>
                      </button>
                    </div>

                    {/* Section commentaires */}
                    <AnimatePresence>
                      {expandedComments[complaint._id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-800"
                        >
                          {/* Formulaire de commentaire */}
                          {user && (
                            <div className="flex gap-2 mb-4">
                              <input
                                type="text"
                                value={commentInputs[complaint._id] || ''}
                                onChange={(e) => setCommentInputs({ ...commentInputs, [complaint._id]: e.target.value })}
                                placeholder="Ajoute ton commentaire..."
                                className="flex-1 bg-dark/50 border border-gray-700 rounded-lg px-4 py-2 text-sm !text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddComment(complaint._id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleAddComment(complaint._id)}
                                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* Liste des commentaires */}
                          <div className="space-y-3">
                            {complaint.comments?.map((comment, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-dark/30 rounded-lg p-3"
                              >
                                <div className="flex items-start gap-3">
                                  <img
                                    src={comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username}`}
                                    alt={comment.author?.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-semibold text-primary-400">
                                        {comment.author?.username}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-300">{comment.content}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {complaint.comments?.length === 0 && (
                            <p className="text-center text-gray-500 text-sm py-4">
                              Aucun commentaire pour l'instant... Sois le premier ! 🎤
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComplaintBox;
