import express from 'express';
import { getDashboardStats } from './analytics.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);

export default router;
