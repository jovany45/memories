import express from 'express';
import { getUserProfile, updateUserProfile, getAllUsers } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.get('/', getAllUsers);
router.get('/:id', getUserProfile);
router.put('/:id', authenticate, updateUserProfile);

export default router;
