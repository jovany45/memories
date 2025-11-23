import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MemoryCard = ({ memory }) => {
  const moodEmojis = {
    funny: '😂',
    emotional: '🥺',
    epic: '🔥',
    geek: '🤓',
    sarcastic: '😏',
    wholesome: '🥰',
    cringe: '😬'
  };

  const typeIcons = {
    photo: '📸',
    video: '🎥',
    anecdote: '📝',
    moment: '⭐'
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="card group cursor-pointer overflow-hidden"
    >
      <Link to={`/memories/${memory._id}`}>
        {/* Media Preview */}
        {memory.mediaUrl && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-dark-800">
            {memory.type === 'video' ? (
              <video
                src={`http://localhost:5000${memory.mediaUrl}`}
                className="w-full h-full object-cover"
                preload="metadata"
              />
            ) : (
              <img
                src={`http://localhost:5000${memory.mediaUrl}`}
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
  );
};

export default MemoryCard;
