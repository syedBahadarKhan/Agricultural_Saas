import express from 'express';
import { getPendingApplications, updateApplicationStatus, getDashboardStats } from './admin.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/applications/pending', getPendingApplications);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/stats', getDashboardStats);

export default router;
