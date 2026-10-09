import express from 'express';
import { getFarms, getFarm, createFarm, updateFarm, deleteFarm } from './farms.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(authorize('FARMER', 'ADMIN'));

router
  .route('/')
  .get(getFarms)
  .post(createFarm);

router
  .route('/:id')
  .get(getFarm)
  .put(updateFarm)
  .delete(deleteFarm);

export default router;
