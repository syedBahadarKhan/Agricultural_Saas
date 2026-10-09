import Shipment from '../../models/shipment.model.js';
import Order from '../../models/order.model.js';

// @desc    Get tracking info for an order
// @route   GET /api/v1/logistics/:orderId
// @access  Private
export const getShipmentByOrder = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ order: req.params.orderId }).populate('order');
    
    if (!shipment) {
      return res.status(404).json({ success: false, error: { message: 'Shipment not found for this order' } });
    }

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc    Create shipment (usually triggered by farmer after payment)
// @route   POST /api/v1/logistics
// @access  Private/Farmer
export const createShipment = async (req, res) => {
  try {
    const { orderId, transporterName, vehicleNumber, driverPhone, estimatedDeliveryDate } = req.body;
    
    const order = await Order.findById(orderId).populate('listing');
    if (!order) return res.status(404).json({ success: false, error: { message: 'Order not found' } });

    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: { message: 'Not authorized' } });
    }

    const shipment = await Shipment.create({
      order: order._id,
      transporterName,
      vehicleNumber,
      driverPhone,
      estimatedDeliveryDate,
      origin: { district: order.listing.location?.district, address: 'Farm location' },
      destination: { district: 'Buyer City', address: order.deliveryDetails?.address }
    });

    order.status = 'SHIPPED';
    await order.save();

    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// @desc    Update shipment status (In-Transit, Delivered)
// @route   PUT /api/v1/logistics/:id/status
// @access  Private
export const updateShipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    
    if (!shipment) return res.status(404).json({ success: false, error: { message: 'Shipment not found' } });

    shipment.status = status;
    if (status === 'DELIVERED') {
      shipment.actualDeliveryDate = Date.now();
      
      const order = await Order.findById(shipment.order);
      if (order) {
        order.status = 'DELIVERED';
        await order.save();
      }
    }
    
    await shipment.save();
    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};
