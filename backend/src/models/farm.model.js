import mongoose from 'mongoose';

const farmPlotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  areaSize: { type: Number, required: true },
  areaUnit: { type: String, enum: ['Acre', 'Hectare', 'Kanal', 'Marla'], default: 'Acre' },
  soilType: { type: String },
  irrigationType: { type: String },
});

const farmSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      address: String,
      city: String,
      region: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    totalArea: {
      type: Number,
      required: true,
    },
    areaUnit: {
      type: String,
      enum: ['Acre', 'Hectare', 'Kanal', 'Marla'],
      default: 'Acre',
    },
    plots: [farmPlotSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
