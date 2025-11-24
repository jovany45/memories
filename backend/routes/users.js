import express from 'express';
import { getUserProfile, updateUserProfile, getAllUsers, generateNewAvatar, getAvatarStyles } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Avatar routes (DOIT être avant les routes avec :id)
router.get('/avatar/styles', getAvatarStyles);
router.post('/:id/avatar/random', authenticate, generateNewAvatar);

// User routes
router.get('/', getAllUsers);
router.get('/:id', getUserProfile);
router.put('/:id', authenticate, updateUserProfile);

export default router;
