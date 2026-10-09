import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop', // Can link to a specific crop being grown
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
    variety: String,
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'STANDARD', 'PREMIUM'],
      default: 'STANDARD',
    },
    quantityAvailable: {
      type: Number,
      required: true,
    },
    quantityUnit: {
      type: String,
      enum: ['KG', 'TON', 'MAUND'],
      default: 'KG',
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    location: {
      district: String,
      address: String,
    },
    expectedHarvestDate: Date,
    isAvailableNow: {
      type: Boolean,
      default: true,
    },
    listingType: {
      type: String,
      enum: ['DIRECT_SALE', 'BIDDING', 'CONTRACT'],
      default: 'DIRECT_SALE',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SOLD_OUT', 'CANCELLED'],
      default: 'ACTIVE',
    },
    images: [String],
    description: String,
  },
  {
    timestamps: true,
  }
);

listingSchema.index({ title: 'text', cropType: 'text', 'location.district': 'text' });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
