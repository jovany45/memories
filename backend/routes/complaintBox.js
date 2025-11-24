import express from 'express';
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  voteComplaint,
  addComment,
  deleteComplaint,
  updateComplaintStatus,
  getComplaintStats
} from '../controllers/complaintBoxController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Routes publiques (anonymes)
router.post('/', createComplaint); // Création anonyme sans auth
router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);

// Routes nécessitant une authentification
router.post('/:id/vote', authenticate, voteComplaint);
router.post('/:id/comment', authenticate, addComment);

// Routes admin
router.delete('/:id', authenticate, isAdmin, deleteComplaint);
router.patch('/:id/status', authenticate, isAdmin, updateComplaintStatus);
router.get('/admin/stats', authenticate, isAdmin, getComplaintStats);

export default router;
