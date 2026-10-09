import express from 'express';
import { getListings, getListingById, createListing, getMyListings, placeOrder } from './marketplace.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Publicly accessible to view active listings
router.get('/listings', getListings);
router.get('/listings/:id', getListingById);

router.use(protect);

// Farmer only actions
router.post('/listings', authorize('FARMER', 'AGGREGATOR', 'ADMIN'), createListing);
router.get('/my-listings', authorize('FARMER', 'AGGREGATOR', 'ADMIN'), getMyListings);

// Buyer only actions
router.post('/orders', authorize('BUYER', 'AGGREGATOR', 'ADMIN'), placeOrder);

export default router;
