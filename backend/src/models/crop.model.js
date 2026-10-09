import mongoose from 'mongoose';

const cropCycleSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ['PLANNING', 'PLANTED', 'GROWING', 'FLOWERING', 'HARVESTING', 'COMPLETED', 'FAILED'],
    default: 'PLANNING',
  },
  plantedDate: Date,
  expectedHarvestDate: Date,
  actualHarvestDate: Date,
  yieldExpected: Number,
  yieldActual: Number,
  yieldUnit: { type: String, default: 'KG' },
  notes: String,
});

const cropSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    plotId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the specific plot inside the Farm
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    variety: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['CEREAL', 'VEGETABLE', 'FRUIT', 'CASH_CROP', 'OTHER'],
    },
    areaPlanted: {
      type: Number,
      required: true,
    },
    areaUnit: {
      type: String,
      enum: ['Acre', 'Hectare', 'Kanal', 'Marla'],
      default: 'Acre',
    },
    cycle: cropCycleSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
