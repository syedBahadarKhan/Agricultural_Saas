import Listing from '../../models/listing.model.js';
import Order from '../../models/order.model.js';
import Crop from '../../models/crop.model.js';
import User from '../../models/user.model.js';

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
    const { listingId, quantity, deliveryDetails, notes, qualityRequirements, deliveryFee } = req.body;
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Listing not found' } });
    }
    
    if (listing.quantityAvailable < quantity) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Not enough quantity available' } });
    }

    const parsedDeliveryFee = typeof deliveryFee === 'number' ? deliveryFee : 0;
    const subtotal = quantity * listing.pricePerUnit;
    const finalTotalPrice = subtotal + parsedDeliveryFee;

    const order = await Order.create({
      buyer: req.user._id,
      seller: listing.farmer,
      listing: listing._id,
      quantity,
      unitPrice: listing.pricePerUnit,
      totalPrice: finalTotalPrice,
      deliveryFee: parsedDeliveryFee,
      currency: listing.currency || 'PKR',
      deliveryDetails,
      notes,
      qualityRequirements: qualityRequirements || listing.grade,
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

// @desc    Get incoming buyer requests/orders for current seller/farmer
// @route   GET /api/v1/marketplace/seller-orders
// @access  Private/Farmer/Aggregator/Admin
export const getSellerOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { seller: req.user._id };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    let orders = await Order.find(query)
      .populate('buyer', 'firstName lastName email phone isVerified accountStatus businessName businessType businessAddress')
      .populate({
        path: 'listing',
        select: 'title cropType variety grade pricePerUnit quantityUnit location currency images description',
      })
      .sort('-createdAt');

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      orders = orders.filter((order) => {
        const buyerName = `${order.buyer?.firstName || ''} ${order.buyer?.lastName || ''}`.toLowerCase();
        const businessName = (order.buyer?.businessName || '').toLowerCase();
        const cropTitle = (order.listing?.title || '').toLowerCase();
        const cropType = (order.listing?.cropType || '').toLowerCase();
        const district = (order.deliveryDetails?.address || '').toLowerCase();
        return (
          buyerName.includes(term) ||
          businessName.includes(term) ||
          cropTitle.includes(term) ||
          cropType.includes(term) ||
          district.includes(term)
        );
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Get single buyer request/order details for authorized seller
// @route   GET /api/v1/marketplace/seller-orders/:id
// @access  Private/Farmer/Aggregator/Admin
export const getSellerOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'firstName lastName email phone isVerified accountStatus businessName businessType businessAddress createdAt')
      .populate({
        path: 'listing',
        populate: {
          path: 'crop',
          select: 'name variety areaPlanted areaUnit cycle',
        },
      });

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order/Request not found' } });
    }

    // Authorization check: Only the seller (farmer) or an Admin can access this
    if (order.seller.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You are not authorized to view this buyer request' } });
    }

    // Count past orders completed by this buyer with this seller (history context)
    const buyerOrderStats = {
      totalOrdersWithFarmer: await Order.countDocuments({ seller: req.user._id, buyer: order.buyer?._id }),
      completedOrdersWithFarmer: await Order.countDocuments({ seller: req.user._id, buyer: order.buyer?._id, status: { $in: ['ACCEPTED', 'PAID', 'SHIPPED', 'DELIVERED'] } }),
    };

    res.status(200).json({
      success: true,
      data: {
        order,
        buyerStats: buyerOrderStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Update order status (Accept, Reject, etc.)
// @route   PATCH /api/v1/marketplace/seller-orders/:id/status
// @access  Private/Farmer/Aggregator/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid status' } });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    if (order.seller.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to update this order' } });
    }

    // If order was rejected or cancelled and had reduced inventory, restore quantity if desired
    if ((status === 'REJECTED' || status === 'CANCELLED') && order.status !== 'REJECTED' && order.status !== 'CANCELLED') {
      const listing = await Listing.findById(order.listing);
      if (listing) {
        listing.quantityAvailable += order.quantity;
        if (listing.status === 'SOLD_OUT' && listing.quantityAvailable > 0) {
          listing.status = 'ACTIVE';
        }
        await listing.save();
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};
