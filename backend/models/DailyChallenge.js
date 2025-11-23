import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  challenge: {
    type: String,
    required: true
  },
  icon: String,
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    memory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memory'
    },
    completedAt: Date
  }]
}, {
  timestamps: true
});

const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);

export default DailyChallenge;
