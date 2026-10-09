import mongoose from 'mongoose';

const rfqSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    requiredQuantity: {
      type: Number,
      required: true,
    },
    quantityUnit: {
      type: String,
      enum: ['KG', 'TON', 'MAUND'],
      default: 'KG',
    },
    preferredGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'STANDARD', 'PREMIUM', 'ANY'],
      default: 'ANY',
    },
    requiredByDate: {
      type: Date,
      required: true,
    },
    deliveryLocation: {
      district: String,
      address: String,
    },
    status: {
      type: String,
      enum: ['OPEN', 'NEGOTIATION', 'CLOSED', 'CANCELLED'],
      default: 'OPEN',
    },
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
      }
    ],
    description: String,
  },
  {
    timestamps: true,
  }
);

rfqSchema.index({ title: 'text', cropType: 'text' });

const Rfq = mongoose.model('Rfq', rfqSchema);
export default Rfq;
