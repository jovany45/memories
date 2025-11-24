import express from 'express';
import {
  getAllIdeas,
  createIdea,
  voteIdea,
  deleteIdea,
  updateIdeaStatus,
  getIdeaStats
} from '../controllers/ideaBoxController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Public routes
router.get('/', getAllIdeas);
router.get('/stats', getIdeaStats);

// Protected routes
router.post('/', authenticate, createIdea);
router.post('/:id/vote', authenticate, voteIdea);
router.delete('/:id', authenticate, deleteIdea);

// Admin routes
router.put('/:id/status', authenticate, isAdmin, updateIdeaStatus);

export default router;
