import User from '../../models/user.model.js';
import VerificationApplication from '../../models/verification.model.js';

export const getPendingApplications = async (req, res) => {
  try {
    const apps = await VerificationApplication.find({ status: 'PENDING_REVIEW' }).populate('user', 'firstName lastName email phone accountStatus');
    res.json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, rejectionReason } = req.body;

    const application = await VerificationApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, error: { message: 'Application not found' } });
    }

    application.status = status;
    application.adminNotes = adminNotes || application.adminNotes;
    application.rejectionReason = rejectionReason || application.rejectionReason;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    const user = await User.findById(application.user);
    if (user) {
      user.accountStatus = status; // Map Verification status directly to account status
      await user.save();
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingApps = await VerificationApplication.countDocuments({ status: 'PENDING_REVIEW' });
    const approvedFarmers = await User.countDocuments({ role: 'FARMER', accountStatus: 'APPROVED' });
    const approvedBuyers = await User.countDocuments({ role: 'BUYER', accountStatus: 'APPROVED' });

    res.json({
      success: true,
      data: {
        totalUsers,
        pendingApps,
        approvedFarmers,
        approvedBuyers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
