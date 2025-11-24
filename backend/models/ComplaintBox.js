import mongoose from 'mongoose';

const complaintBoxSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['vie_quotidienne', 'nourriture', 'infrastructure', 'administration', 'relations', 'autre'],
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
    enum: ['pending', 'acknowledged', 'in_progress', 'resolved', 'rejected', 'ignored'],
    default: 'pending'
  },
  adminComment: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual pour calculer le score
complaintBoxSchema.virtual('score').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// S'assurer que les virtuals sont inclus dans la conversion JSON
complaintBoxSchema.set('toJSON', { virtuals: true });
complaintBoxSchema.set('toObject', { virtuals: true });

const ComplaintBox = mongoose.model('ComplaintBox', complaintBoxSchema);

export default ComplaintBox;
