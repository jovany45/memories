import DailyChallenge from '../models/DailyChallenge.js';
import MemoryDuel from '../models/MemoryDuel.js';
import Memory from '../models/Memory.js';
import User from '../models/User.js';
import { generateDailyChallenges } from '../utils/funFeatures.js';
import { KARMA_ACTIONS } from '../utils/achievements.js';

// @desc    Get today's challenge
// @route   GET /api/features/daily-challenge
// @access  Public
export const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let challenge = await DailyChallenge.findOne({ date: today })
      .populate('participants.user', 'username avatar')
      .populate('participants.memory');
    
    if (!challenge) {
      const challengeData = generateDailyChallenges();
      challenge = new DailyChallenge({
        date: today,
        challenge: challengeData.text,
        icon: challengeData.icon
      });
      await challenge.save();
    }
    
    res.json({ challenge });
  } catch (error) {
    console.error('Get daily challenge error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du défi', error: error.message });
  }
};

// @desc    Complete daily challenge
// @route   POST /api/features/daily-challenge/complete
// @access  Private
export const completeDailyChallenge = async (req, res) => {
  try {
    const { memoryId } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const challenge = await DailyChallenge.findOne({ date: today });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Aucun défi pour aujourd\'hui' });
    }
    
    // Check if user already completed
    const alreadyCompleted = challenge.participants.some(
      p => p.user.toString() === req.userId.toString()
    );
    
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Tu as déjà complété le défi d\'aujourd\'hui !' });
    }
    
    challenge.participants.push({
      user: req.userId,
      memory: memoryId,
      completedAt: new Date()
    });
    
    await challenge.save();
    
    // Award karma
    const user = await User.findById(req.userId);
    user.karma += KARMA_ACTIONS.COMPLETE_CHALLENGE;
    await user.save();
    
    res.json({
      message: '🎉 Défi complété !',
      karmaEarned: KARMA_ACTIONS.COMPLETE_CHALLENGE,
      challenge
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({ message: 'Erreur lors de la complétion du défi', error: error.message });
  }
};

// @desc    Create a memory duel
// @route   POST /api/features/duels
// @access  Private
export const createDuel = async (req, res) => {
  try {
    const { memory1Id, memory2Id, title, duration = 7 } = req.body;
    
    const memory1 = await Memory.findById(memory1Id);
    const memory2 = await Memory.findById(memory2Id);
    
    if (!memory1 || !memory2) {
      return res.status(404).json({ message: 'Un ou plusieurs souvenirs introuvables' });
    }
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);
    
    const duel = new MemoryDuel({
      title: title || `${memory1.title} vs ${memory2.title}`,
      memory1: memory1Id,
      memory2: memory2Id,
      endDate
    });
    
    await duel.save();
    
    const populatedDuel = await MemoryDuel.findById(duel._id)
      .populate('memory1')
      .populate('memory2');
    
    res.status(201).json({
      message: '⚔️ Duel créé !',
      duel: populatedDuel
    });
  } catch (error) {
    console.error('Create duel error:', error);
    res.status(500).json({ message: 'Erreur lors de la création du duel', error: error.message });
  }
};

// @desc    Vote in a duel
// @route   POST /api/features/duels/:id/vote
// @access  Private
export const voteInDuel = async (req, res) => {
  try {
    const { choice } = req.body; // 1 or 2
    
    const duel = await MemoryDuel.findById(req.params.id);
    
    if (!duel) {
      return res.status(404).json({ message: 'Duel introuvable' });
    }
    
    if (duel.status === 'ended') {
      return res.status(400).json({ message: 'Ce duel est terminé' });
    }
    
    // Check if user already voted
    const existingVote = duel.votes.find(
      v => v.user.toString() === req.userId.toString()
    );
    
    if (existingVote) {
      existingVote.choice = choice;
    } else {
      duel.votes.push({
        user: req.userId,
        choice,
        votedAt: new Date()
      });
    }
    
    await duel.save();
    
    // Calculate votes
    const votes1 = duel.votes.filter(v => v.choice === 1).length;
    const votes2 = duel.votes.filter(v => v.choice === 2).length;
    
    res.json({
      message: '✅ Vote enregistré !',
      results: {
        memory1Votes: votes1,
        memory2Votes: votes2,
        total: duel.votes.length
      }
    });
  } catch (error) {
    console.error('Vote duel error:', error);
    res.status(500).json({ message: 'Erreur lors du vote', error: error.message });
  }
};

// @desc    Get active duels
// @route   GET /api/features/duels
// @access  Public
export const getActiveDuels = async (req, res) => {
  try {
    const duels = await MemoryDuel.find({ status: 'active' })
      .populate({
        path: 'memory1',
        populate: { path: 'author', select: 'username avatar' }
      })
      .populate({
        path: 'memory2',
        populate: { path: 'author', select: 'username avatar' }
      })
      .sort({ createdAt: -1 });
    
    const duelsWithResults = duels.map(duel => {
      const votes1 = duel.votes.filter(v => v.choice === 1).length;
      const votes2 = duel.votes.filter(v => v.choice === 2).length;
      
      return {
        ...duel.toObject(),
        results: {
          memory1Votes: votes1,
          memory2Votes: votes2,
          total: duel.votes.length
        }
      };
    });
    
    res.json({ duels: duelsWithResults });
  } catch (error) {
    console.error('Get duels error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des duels', error: error.message });
  }
};

export default {
  getDailyChallenge,
  completeDailyChallenge,
  createDuel,
  voteInDuel,
  getActiveDuels
};
