import Farm from '../../models/farm.model.js';
import Crop from '../../models/crop.model.js';
import Listing from '../../models/listing.model.js';
import Order from '../../models/order.model.js';

// @desc    Get Dashboard Statistics
// @route   GET /api/v1/analytics/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    
    let stats = {};

    if (role === 'FARMER' || role === 'AGGREGATOR' || role === 'ADMIN') {
      const totalFarms = await Farm.countDocuments({ owner: userId });
      const activeCrops = await Crop.countDocuments({ owner: userId, isActive: true });
      const activeListings = await Listing.countDocuments({ farmer: userId, status: 'ACTIVE' });
      const pendingOrders = await Order.countDocuments({ seller: userId, status: 'PENDING' });
      
      const recentListings = await Listing.find({ farmer: userId })
        .sort('-createdAt')
        .limit(5);
        
      const recentOrders = await Order.find({ seller: userId })
        .populate('buyer', 'firstName lastName')
        .populate('listing', 'title cropType pricePerUnit')
        .sort('-createdAt')
        .limit(5);

      stats = {
        totalFarms,
        activeCrops,
        activeListings,
        pendingOrders,
        recentListings,
        recentOrders
      };
    } else if (role === 'BUYER') {
      const activeOrders = await Order.countDocuments({ buyer: userId, status: { $in: ['PENDING', 'ACCEPTED', 'SHIPPED'] } });
      const totalOrders = await Order.countDocuments({ buyer: userId });
      
      // Calculate total spent
      const orders = await Order.find({ buyer: userId, status: { $ne: 'CANCELLED' } });
      const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      const recentOrders = await Order.find({ buyer: userId })
        .populate('seller', 'firstName lastName phone')
        .populate('listing', 'title cropType location')
        .sort('-createdAt')
        .limit(5);
        
      const marketListings = await Listing.find({ status: 'ACTIVE' })
        .sort('-createdAt')
        .limit(4);

      stats = {
        activeOrders,
        totalOrders,
        totalSpent,
        recentOrders,
        marketListings
      };
    }

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};
