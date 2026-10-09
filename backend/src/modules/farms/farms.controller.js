import Farm from '../../models/farm.model.js';

// @desc    Get all farms for the logged in user
// @route   GET /api/v1/farms
// @access  Private/Farmer
export const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user._id });
    res.status(200).json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Get single farm
// @route   GET /api/v1/farms/:id
// @access  Private/Farmer
export const getFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, owner: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Farm not found' } });
    }
    res.status(200).json({ success: true, data: farm });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Create new farm
// @route   POST /api/v1/farms
// @access  Private/Farmer
export const createFarm = async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const farm = await Farm.create(req.body);
    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
  }
};

// @desc    Update farm
// @route   PUT /api/v1/farms/:id
// @access  Private/Farmer
export const updateFarm = async (req, res) => {
  try {
    let farm = await Farm.findOne({ _id: req.params.id, owner: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Farm not found' } });
    }
    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: farm });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Delete farm
// @route   DELETE /api/v1/farms/:id
// @access  Private/Farmer
export const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, owner: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Farm not found' } });
    }
    await farm.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};
