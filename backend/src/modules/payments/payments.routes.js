import express from 'express';
import { createPaymentIntent, confirmPayment } from './payments.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/create-intent', authorize('BUYER', 'ADMIN'), createPaymentIntent);
router.post('/confirm', authorize('BUYER', 'ADMIN'), confirmPayment);

export default router;
