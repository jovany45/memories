import express from 'express';
import { getUserProfile, updateUserProfile, getAllUsers, generateNewAvatar, getAvatarStyles } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.get('/', getAllUsers);
router.get('/:id', getUserProfile);
router.put('/:id', authenticate, updateUserProfile);

// Avatar routes
router.get('/avatar/styles', getAvatarStyles);
router.post('/:id/avatar/random', authenticate, generateNewAvatar);

export default router;
