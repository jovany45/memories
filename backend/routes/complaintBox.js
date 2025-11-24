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
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Routes publiques (anonymes)
router.post('/', createComplaint); // Création anonyme sans auth
router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);

// Routes nécessitant une authentification
router.post('/:id/vote', auth, voteComplaint);
router.post('/:id/comment', auth, addComment);

// Routes admin
router.delete('/:id', auth, isAdmin, deleteComplaint);
router.patch('/:id/status', auth, isAdmin, updateComplaintStatus);
router.get('/admin/stats', auth, isAdmin, getComplaintStats);

export default router;
