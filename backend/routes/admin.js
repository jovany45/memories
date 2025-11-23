import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { isAdmin, logAdminAction } from '../middleware/isAdmin.js';
import {
  getGlobalStats,
  getAllUsers,
  getUserDetails,
  toggleUserRole,
  toggleUserStatus,
  updateUser,
  deleteUser,
  getAllMemories,
  deleteMemory,
  getActivityLogs,
  resetUserPassword
} from '../controllers/adminController.js';

const router = express.Router();

// Toutes les routes nécessitent authentification + droits admin
router.use(authenticate);
router.use(isAdmin);
router.use(logAdminAction);

// 📊 Statistiques
router.get('/stats', getGlobalStats);
router.get('/logs', getActivityLogs);

// 👥 Gestion des utilisateurs
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-role', toggleUserRole);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.post('/users/:id/reset-password', resetUserPassword);

// 📝 Gestion des souvenirs
router.get('/memories', getAllMemories);
router.delete('/memories/:id', deleteMemory);

export default router;
