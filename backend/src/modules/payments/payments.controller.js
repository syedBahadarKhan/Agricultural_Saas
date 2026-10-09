import Order from '../../models/order.model.js';

// Mock Stripe Service
// In a real production app, you would require('stripe')(process.env.STRIPE_SECRET_KEY)
const stripeMock = {
  paymentIntents: {
    create: async (data) => ({
      id: `pi_mock_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `seti_mock_${Math.random().toString(36).substr(2, 9)}`,
      amount: data.amount,
      status: 'requires_payment_method'
    })
  }
};

// @desc    Create a payment intent for an order
// @route   POST /api/v1/payments/create-intent
// @access  Private/Buyer
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: { message: 'Order not found' } });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: { message: 'Not authorized to pay for this order' } });
    }

    // Platform fee logic (e.g., 5% platform fee)
    const platformFee = order.totalPrice * 0.05;
    const amountToCharge = order.totalPrice + platformFee;

    // Create payment intent
    const paymentIntent = await stripeMock.paymentIntents.create({
      amount: Math.round(amountToCharge * 100), // convert to cents
      currency: 'pkr',
      metadata: {
        orderId: order._id.toString(),
        sellerId: order.seller.toString(),
        platformFee: platformFee.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      breakdown: {
        subtotal: order.totalPrice,
        platformFee,
        total: amountToCharge
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc    Confirm payment success (Webhook/Callback simulation)
// @route   POST /api/v1/payments/confirm
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: { message: 'Order not found' } });
    }

    order.paymentStatus = 'PAID';
    order.status = 'ACCEPTED';
    await order.save();

    res.status(200).json({ success: true, message: 'Payment confirmed. Funds held in escrow.' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
