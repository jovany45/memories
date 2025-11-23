import express from 'express';
import {
  getLeaderboard,
  getUserAchievements,
  getUserStats
} from '../controllers/gamificationController.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/achievements/:userId', getUserAchievements);
router.get('/stats/:userId', getUserStats);

export default router;
