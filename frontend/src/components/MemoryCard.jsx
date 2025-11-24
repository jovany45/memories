import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Calendar, Maximize2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BASE_URL } from '../api/axios';
import { useState } from 'react';

const MemoryCard = ({ memory }) => {
  const [showPreview, setShowPreview] = useState(false);

  const moodEmojis = {
    funny: '😂',
    emotional: '🥺',
    epic: '🔥',
    geek: '🤓',
    sarcastic: '😏',
    wholesome: '🥰',
    cringe: '😬',
    excited: '🤩',
    nostalgic: '🌅',
    proud: '💪',
    mysterious: '🌙',
    romantic: '💕',
    zen: '🧘',
    chaotic: '🌪️'
  };

  const typeIcons = {
    photo: '📸',
    video: '🎥',
    anecdote: '📝',
    moment: '⭐'
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="card group cursor-pointer overflow-hidden relative"
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        <Link to={`/memory/${memory._id}`}>
        {/* Media Preview */}
        {memory.mediaUrl && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-dark-800">
            {memory.type === 'video' ? (
              <video
                src={`${BASE_URL}${memory.mediaUrl}`}
                className="w-full h-full object-cover"
                preload="metadata"
              />
            ) : (
              <img
                src={`${BASE_URL}${memory.mediaUrl}`}
                alt={memory.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            )}
            <div className="absolute top-3 left-3">
              <span className="badge badge-primary backdrop-blur-lg">
                {typeIcons[memory.type]} {memory.type}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="text-2xl">{moodEmojis[memory.mood]}</span>
            </div>
            
            {/* Hover Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showPreview ? 1 : 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <Maximize2 size={48} className="mx-auto mb-2" />
                <p className="text-sm">Survoler pour agrandir</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
            {memory.title}
          </h3>

          <p className="text-gray-400 line-clamp-2">
            {memory.description}
          </p>

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {memory.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Audio Badge si présent */}
          {memory.audioUrl && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Anecdote vocale disponible</span>
            </div>
          )}

          {/* Author & Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/profile/${memory.author._id}`;
              }}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img
                src={memory.author.avatar}
                alt={memory.author.username}
                className="w-8 h-8 rounded-full border-2 border-primary-500"
              />
              <span className="text-sm text-gray-300">{memory.author.username}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <span className="flex items-center space-x-1">
                <Heart size={16} />
                <span>{memory.likesCount || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle size={16} />
                <span>{memory.commentsCount || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{memory.viewCount || 0}</span>
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar size={14} />
            <span>
              {format(new Date(memory.createdAt), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
      </Link>
      </motion.div>

      {/* Preview Modal on Hover */}
      <AnimatePresence>
        {showPreview && memory.mediaUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              className="relative z-10 max-w-4xl max-h-[80vh] w-full mx-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="bg-dark-800 rounded-2xl overflow-hidden shadow-2xl border border-primary-500/30">
                {/* Preview Content */}
                <div className="relative">
                  {memory.type === 'video' ? (
                    <video
                      src={`${BASE_URL}${memory.mediaUrl}`}
                      className="w-full max-h-[70vh] object-contain"
                      controls
                      autoPlay
                      muted
                    />
                  ) : memory.type === 'photo' ? (
                    <img
                      src={`${BASE_URL}${memory.mediaUrl}`}
                      alt={memory.title}
                      className="w-full max-h-[70vh] object-contain"
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <span className="text-6xl mb-4 block">{typeIcons[memory.type]}</span>
                      <h3 className="text-2xl font-bold text-white mb-4">{memory.title}</h3>
                      <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                        {memory.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Preview Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{memory.title}</h3>
                    <p className="text-gray-300 mb-3 line-clamp-2">{memory.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Heart size={16} className="text-red-400" />
                          <span>{memory.likesCount || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle size={16} className="text-blue-400" />
                          <span>{memory.commentsCount || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye size={16} className="text-green-400" />
                          <span>{memory.viewCount || 0}</span>
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Cliquer pour ouvrir
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MemoryCard;
