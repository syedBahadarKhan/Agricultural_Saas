import Listing from '../../models/listing.model.js';
import Order from '../../models/order.model.js';

// @desc    Get all active listings
// @route   GET /api/v1/marketplace/listings
// @access  Private
export const getListings = async (req, res) => {
  try {
    const { search, cropType, district } = req.query;
    let query = { status: 'ACTIVE' };

    if (search) query.$text = { $search: search };
    if (cropType) query.cropType = { $regex: new RegExp(cropType, 'i') };
    if (district) query['location.district'] = { $regex: new RegExp(district, 'i') };

    const listings = await Listing.find(query)
      .populate('farmer', 'firstName lastName phone')
      .sort('-createdAt');
      
    res.status(200).json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Get single listing
// @route   GET /api/v1/marketplace/listings/:id
// @access  Public
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('farmer', 'firstName lastName phone');
    if (!listing) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Listing not found' } });
    }
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Create a new listing
// @route   POST /api/v1/marketplace/listings
// @access  Private/Farmer/Aggregator
export const createListing = async (req, res) => {
  try {
    req.body.farmer = req.user._id;
    const listing = await Listing.create(req.body);
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
  }
};

// @desc    Get my listings (Farmer)
// @route   GET /api/v1/marketplace/my-listings
// @access  Private/Farmer
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ farmer: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Place an order
// @route   POST /api/v1/marketplace/orders
// @access  Private/Buyer
export const placeOrder = async (req, res) => {
  try {
    const { listingId, quantity, deliveryDetails } = req.body;
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Listing not found' } });
    }
    
    if (listing.quantityAvailable < quantity) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Not enough quantity available' } });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: listing.farmer,
      listing: listing._id,
      quantity,
      unitPrice: listing.pricePerUnit,
      totalPrice: quantity * listing.pricePerUnit,
      deliveryDetails
    });

    listing.quantityAvailable -= quantity;
    if (listing.quantityAvailable === 0) {
      listing.status = 'SOLD_OUT';
    }
    await listing.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
  }
};
