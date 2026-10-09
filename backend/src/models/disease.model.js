import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['CHEMICAL', 'ORGANIC', 'BIOLOGICAL', 'CULTURAL'],
    required: true,
  },
  instructions: String,
  products: [String],
  verified: { type: Boolean, default: false },
});

const diseaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['FUNGAL', 'BACTERIAL', 'VIRAL', 'PEST', 'NUTRITIONAL_DEFICIENCY', 'OTHER'],
      required: true,
    },
    affectedCrops: [{ type: String }],
    symptoms: [{ type: String }],
    causes: String,
    riskFactors: [{ type: String }],
    severity: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'SEVERE'],
      default: 'MODERATE',
    },
    affectedParts: [{ type: String }],
    prevention: String,
    culturalPractices: String,
    treatments: [treatmentSchema],
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sources: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Enable text search
diseaseSchema.index({ name: 'text', symptoms: 'text', affectedCrops: 'text' });

const Disease = mongoose.model('Disease', diseaseSchema);
export default Disease;
