import Disease from '../../models/disease.model.js';

// @desc    Search diseases
// @route   GET /api/v1/diseases
// @access  Private
export const getDiseases = async (req, res) => {
  try {
    const { search, crop } = req.query;
    let query = { verificationStatus: 'APPROVED' };

    if (search) {
      query.$text = { $search: search };
    }
    
    if (crop) {
      query.affectedCrops = { $regex: new RegExp(crop, 'i') };
    }

    const diseases = await Disease.find(query).limit(20);
    res.status(200).json({ success: true, count: diseases.length, data: diseases });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Get single disease
// @route   GET /api/v1/diseases/:id
// @access  Private
export const getDisease = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Disease not found' } });
    }
    res.status(200).json({ success: true, data: disease });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

// @desc    Submit a disease/treatment (Contributor)
// @route   POST /api/v1/diseases
// @access  Private/Contributor
export const createDisease = async (req, res) => {
  try {
    req.body.submittedBy = req.user._id;
    // Default to pending for non-admins
    req.body.verificationStatus = req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING';
    
    const disease = await Disease.create(req.body);
    res.status(201).json({ success: true, data: disease });
  } catch (error) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
  }
};
