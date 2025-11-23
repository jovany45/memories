import express from 'express';
import { body } from 'express-validator';
import {
  createMemory,
  getAllMemories,
  getMemory,
  updateMemory,
  deleteMemory,
  toggleLike,
  addComment,
  deleteComment,
  addReaction,
  addReview,
  addContributor,
  createMashup,
  chainMemory,
  getMemoryChain
} from '../controllers/memoryController.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const memoryValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le titre doit contenir entre 1 et 100 caractères'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('La description doit contenir entre 1 et 2000 caractères'),
  body('type')
    .isIn(['photo', 'video', 'anecdote', 'moment'])
    .withMessage('Type invalide')
];

// Routes
router.get('/', getAllMemories);
router.get('/:id', getMemory);
router.post('/', authenticate, upload.single('media'), memoryValidation, createMemory);
router.put('/:id', authenticate, updateMemory);
router.delete('/:id', authenticate, deleteMemory);

// Like/Unlike
router.post('/:id/like', authenticate, toggleLike);

// Comments
router.post('/:id/comments', authenticate, addComment);
router.delete('/:id/comments/:commentId', authenticate, deleteComment);

// New Features
router.post('/:id/react', authenticate, addReaction);
router.post('/:id/review', authenticate, addReview);
router.post('/:id/contribute', authenticate, addContributor);
router.post('/mashup', authenticate, createMashup);
router.post('/:id/chain', authenticate, chainMemory);
router.get('/:id/chain', getMemoryChain);

export default router;
