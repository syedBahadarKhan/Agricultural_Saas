import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    trackingNumber: {
      type: String,
      unique: true,
    },
    transporterName: String,
    vehicleNumber: String,
    driverPhone: String,
    status: {
      type: String,
      enum: ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'ISSUE'],
      default: 'PENDING',
    },
    origin: {
      address: String,
      district: String,
    },
    destination: {
      address: String,
      district: String,
    },
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    qrCodeString: String, // Traceability QR code hash
  },
  {
    timestamps: true,
  }
);

// Auto-generate tracking number and QR string on creation
shipmentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.trackingNumber = `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    this.qrCodeString = `AGRISAAS-TRACE-${this.order}-${this.trackingNumber}`;
  }
  next();
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;
