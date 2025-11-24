import mongoose from 'mongoose';

const ideaBoxSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['infrastructure', 'nourriture', 'cours', 'ambiance', 'technologie', 'autre'],
    default: 'autre'
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'implemented', 'abandoned'],
    default: 'pending'
  },
  adminComment: {
    type: String,
    default: null
  },
  isJoke: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculer le score total
ideaBoxSchema.virtual('score').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Calculer le pourcentage de likes
ideaBoxSchema.virtual('likePercentage').get(function() {
  const total = this.upvotes.length + this.downvotes.length;
  if (total === 0) return 0;
  return Math.round((this.upvotes.length / total) * 100);
});

ideaBoxSchema.set('toJSON', { virtuals: true });
ideaBoxSchema.set('toObject', { virtuals: true });

const IdeaBox = mongoose.model('IdeaBox', ideaBoxSchema);

export default IdeaBox;
