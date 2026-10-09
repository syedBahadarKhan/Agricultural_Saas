import express from 'express';
import { getRfqs, createRfq, submitBid, acceptBid } from './rfq.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getRfqs)
  .post(authorize('BUYER', 'ADMIN'), createRfq);

router.post('/:id/bids', authorize('FARMER', 'AGGREGATOR', 'ADMIN'), submitBid);
router.post('/bids/:bidId/accept', authorize('BUYER', 'ADMIN'), acceptBid);

export default router;
