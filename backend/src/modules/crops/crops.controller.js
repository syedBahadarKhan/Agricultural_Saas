import Crop from '../../models/crop.model.js';
import Farm from '../../models/farm.model.js';

// @desc    Get all crops for the logged in user
// @route   GET /api/v1/crops
// @access  Private/Farmer
export const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ owner: req.user._id }).populate('farm', 'name location');
    res.status(200).json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Get single crop
// @route   GET /api/v1/crops/:id
// @access  Private/Farmer
export const getCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, owner: req.user._id }).populate('farm', 'name location');
    if (!crop) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Crop not found' } });
    }
    res.status(200).json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Create new crop
// @route   POST /api/v1/crops
// @access  Private/Farmer
export const createCrop = async (req, res) => {
  try {
    req.body.owner = req.user._id;
    
    // Validate that the farm belongs to the user
    const farm = await Farm.findOne({ _id: req.body.farm, owner: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Farm not found or does not belong to user' } });
    }

    const crop = await Crop.create(req.body);
    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
  }
};

// @desc    Update crop
// @route   PUT /api/v1/crops/:id
// @access  Private/Farmer
export const updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findOne({ _id: req.params.id, owner: req.user._id });
    if (!crop) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Crop not found' } });
    }

    // if farm is being updated, validate ownership
    if (req.body.farm && req.body.farm !== crop.farm.toString()) {
       const farm = await Farm.findOne({ _id: req.body.farm, owner: req.user._id });
       if (!farm) {
         return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Farm not found or does not belong to user' } });
       }
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Delete crop
// @route   DELETE /api/v1/crops/:id
// @access  Private/Farmer
export const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, owner: req.user._id });
    if (!crop) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Crop not found' } });
    }
    await crop.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};
