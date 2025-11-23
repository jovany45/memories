import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ThumbsUp, AlertCircle, MessageCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { memoryAPI } from '../api';
import { BASE_URL } from '../api/axios';

const CodeReview = ({ memory, onReviewAdded }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewType, setReviewType] = useState('approved');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Ajoute un commentaire !');
      return;
    }

    setLoading(true);
    try {
      await memoryAPI.addReview(memory._id, {
        type: reviewType,
        comment: comment.trim()
      });

      toast.success(`✅ Review "${reviewType === 'approved' ? 'Approuvé' : 'Changements demandés'}" envoyée !`);
      setComment('');
      setShowReviewForm(false);
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de la review');
    } finally {
      setLoading(false);
    }
  };

  const getReviewIcon = (type) => {
    switch (type) {
      case 'approved':
        return <ThumbsUp className="text-green-400" size={20} />;
      case 'changesRequested':
        return <AlertCircle className="text-orange-400" size={20} />;
      default:
        return <MessageCircle className="text-blue-400" size={20} />;
    }
  };

  const getReviewColor = (type) => {
    switch (type) {
      case 'approved':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'changesRequested':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const approvedCount = memory.reviews?.filter(r => r.type === 'approved').length || 0;
  const changesCount = memory.reviews?.filter(r => r.type === 'changesRequested').length || 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
            <Code className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Code Review</h3>
            <p className="text-sm text-gray-400">
              {memory.reviews?.length || 0} review(s) • 
              <span className="text-green-400 ml-1">✓ {approvedCount}</span> • 
              <span className="text-orange-400 ml-1">⚠ {changesCount}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all"
        >
          {showReviewForm ? 'Annuler' : '+ Review'}
        </button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmitReview}
            className="bg-gray-800 rounded-lg p-4 mb-4"
          >
            {/* Review Type */}
            <div className="flex space-x-3 mb-4">
              <button
                type="button"
                onClick={() => setReviewType('approved')}
                className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                  reviewType === 'approved'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ThumbsUp size={20} />
                  <span className="font-bold">Approuver</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setReviewType('changesRequested')}
                className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                  reviewType === 'changesRequested'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <AlertCircle size={20} />
                  <span className="font-bold">Changements</span>
                </div>
              </button>
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                reviewType === 'approved'
                  ? 'Super boulot ! Explique ce qui est bien...'
                  : 'Explique ce qui doit être amélioré...'
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none mb-4"
              rows="4"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                reviewType === 'approved'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Envoi...' : 'Envoyer la Review'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {memory.reviews && memory.reviews.length > 0 && (
        <div className="space-y-3">
          {memory.reviews.map((review, index) => (
            <motion.div
              key={review._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-2 rounded-lg p-4 ${getReviewColor(review.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getReviewIcon(review.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-2">
                      {review.reviewer?.profilePicture ? (
                        <img
                          src={`${BASE_URL}${review.reviewer.profilePicture}`}
                          alt={review.reviewer.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                          <User size={14} className="text-gray-400" />
                        </div>
                      )}
                      <span className="font-bold">{review.reviewer?.name || 'Anonyme'}</span>
                    </div>
                    <span className="text-xs opacity-75">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="font-medium mb-1">
                    {review.type === 'approved' ? '✅ Approuvé' : '⚠️ Changements demandés'}
                  </p>
                  <p className="opacity-90">{review.comment}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {(!memory.reviews || memory.reviews.length === 0) && !showReviewForm && (
        <div className="text-center py-8 text-gray-500">
          <Code size={48} className="mx-auto mb-2 opacity-50" />
          <p>Aucune review pour le moment</p>
          <p className="text-sm">Sois le premier à donner ton avis !</p>
        </div>
      )}
    </div>
  );
};

export default CodeReview;
