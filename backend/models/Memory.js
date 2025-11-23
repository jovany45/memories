import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Le commentaire ne peut pas être vide'],
    maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
  },
  gifUrl: {
    type: String,
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['thumbsup', 'thumbsdown', 'laugh', 'party', 'confused', 'heart', 'rocket', 'eyes'],
    required: true
  }
}, {
  timestamps: true
});

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['approved', 'changes_requested', 'pending'],
    required: true
  },
  comment: String
}, {
  timestamps: true
});

const memorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['photo', 'video', 'anecdote', 'moment'],
    required: true
  },
  mediaUrl: {
    type: String,
    default: null
  },
  thumbnail: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  mood: {
    type: String,
    enum: ['funny', 'emotional', 'epic', 'geek', 'sarcastic', 'wholesome', 'cringe'],
    default: 'wholesome'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  
  // GitHub-style Reactions
  reactions: [reactionSchema],
  
  // Code Review System
  reviews: [reviewSchema],
  codeReviewStatus: {
    type: String,
    enum: ['draft', 'review', 'approved', 'merged'],
    default: 'draft'
  },
  
  // Collaborative Memories
  contributors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    contribution: String,
    addedAt: Date
  }],
  
  // Time Capsule
  isTimeCapsule: {
    type: Boolean,
    default: false
  },
  unlockDate: {
    type: Date,
    default: null
  },
  
  // Cringe Detector
  cringeScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  cringeComment: String,
  
  // Voice Notes
  voiceNoteUrl: String,
  
  // Spotify Integration
  spotifyTrack: {
    id: String,
    name: String,
    artist: String,
    previewUrl: String,
    albumArt: String
  },
  
  // Before/After
  isBeforeAfter: {
    type: Boolean,
    default: false
  },
  beforeImage: String,
  afterImage: String,
  
  // Memory Chain
  parentMemory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory',
    default: null
  },
  childMemories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory'
  }],
  
  isPublic: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
memorySchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for likes count
memorySchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
memorySchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Include virtuals in JSON
memorySchema.set('toJSON', { virtuals: true });
memorySchema.set('toObject', { virtuals: true });

const Memory = mongoose.model('Memory', memorySchema);

export default Memory;
