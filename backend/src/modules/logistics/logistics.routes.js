import express from 'express';
import { getShipmentByOrder, createShipment, updateShipmentStatus } from './logistics.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/:orderId', getShipmentByOrder);
router.post('/', authorize('FARMER', 'AGGREGATOR', 'ADMIN'), createShipment);
router.put('/:id/status', updateShipmentStatus); // Farmer or Logistic Provider

export default router;
