import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    submittedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    documents: [String],
    status: {
      type: String,
      enum: ['PENDING_REVIEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED'],
      default: 'PENDING_REVIEW',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    rejectionReason: String,
    changeRequest: String,
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

const VerificationApplication = mongoose.model('VerificationApplication', verificationSchema);
export default VerificationApplication;
