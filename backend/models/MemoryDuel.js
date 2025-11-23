import mongoose from 'mongoose';

const memoryDuelSchema = new mongoose.Schema({
  title: String,
  memory1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory',
    required: true
  },
  memory2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory',
    required: true
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    choice: {
      type: Number,
      enum: [1, 2]
    },
    votedAt: Date
  }],
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  }
}, {
  timestamps: true
});

const MemoryDuel = mongoose.model('MemoryDuel', memoryDuelSchema);

export default MemoryDuel;
