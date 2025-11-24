import express from 'express';
import {
  getDailyChallenge,
  completeDailyChallenge,
  createDuel,
  voteInDuel,
  getActiveDuels
} from '../controllers/featuresController.js';
import {
  getRandomPublicationIdea,
  getMultipleIdeas as getMultiplePublicationIdeas,
  getIdeasStats
} from '../controllers/ideaController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Daily Challenge
router.get('/daily-challenge', getDailyChallenge);
router.post('/daily-challenge/complete', authenticate, completeDailyChallenge);

// Duels
router.get('/duels', getActiveDuels);
router.post('/duels', authenticate, createDuel);
router.post('/duels/:id/vote', authenticate, voteInDuel);

// Idea Generator
router.get('/idea-generator', getRandomPublicationIdea);
router.get('/idea-generator/multiple', getMultiplePublicationIdeas);
router.get('/idea-generator/stats', getIdeasStats);

export default router;
