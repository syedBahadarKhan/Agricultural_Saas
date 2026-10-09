import express from 'express';
import { getCrops, getCrop, createCrop, updateCrop, deleteCrop } from './crops.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('FARMER', 'ADMIN'));

router
  .route('/')
  .get(getCrops)
  .post(createCrop);

router
  .route('/:id')
  .get(getCrop)
  .put(updateCrop)
  .delete(deleteCrop);

export default router;
