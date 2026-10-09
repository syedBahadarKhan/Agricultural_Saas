import Rfq from '../../models/rfq.model.js';
import Bid from '../../models/bid.model.js';

// @desc    Get all open RFQs (for farmers to see)
// @route   GET /api/v1/rfq
// @access  Private
export const getRfqs = async (req, res) => {
  try {
    const rfqs = await Rfq.find({ status: 'OPEN' })
      .populate('buyer', 'firstName lastName')
      .populate('bids')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: rfqs.length, data: rfqs });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// @desc    Create an RFQ
// @route   POST /api/v1/rfq
// @access  Private/Buyer
export const createRfq = async (req, res) => {
  try {
    req.body.buyer = req.user._id;
    const rfq = await Rfq.create(req.body);
    res.status(201).json({ success: true, data: rfq });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// @desc    Submit a bid on an RFQ
// @route   POST /api/v1/rfq/:id/bids
// @access  Private/Farmer
export const submitBid = async (req, res) => {
  try {
    const rfq = await Rfq.findById(req.params.id);
    if (!rfq || rfq.status !== 'OPEN') {
      return res.status(404).json({ success: false, error: { message: 'RFQ not found or closed' } });
    }

    req.body.rfq = rfq._id;
    req.body.farmer = req.user._id;
    
    const bid = await Bid.create(req.body);
    rfq.bids.push(bid._id);
    await rfq.save();

    res.status(201).json({ success: true, data: bid });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// @desc    Accept a bid
// @route   POST /api/v1/rfq/bids/:bidId/accept
// @access  Private/Buyer
export const acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId).populate('rfq');
    if (!bid) {
      return res.status(404).json({ success: false, error: { message: 'Bid not found' } });
    }

    if (bid.rfq.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: { message: 'Not authorized' } });
    }

    bid.status = 'ACCEPTED';
    await bid.save();

    // Close the RFQ
    bid.rfq.status = 'CLOSED';
    await bid.rfq.save();

    res.status(200).json({ success: true, data: bid });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};
