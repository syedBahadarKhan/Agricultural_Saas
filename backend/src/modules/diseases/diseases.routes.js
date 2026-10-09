import express from 'express';
import { getDiseases, getDisease, createDisease } from './diseases.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getDiseases)
  .post(authorize('CONTRIBUTOR', 'EXPERT', 'ADMIN'), createDisease);

router
  .route('/:id')
  .get(getDisease);

export default router;
