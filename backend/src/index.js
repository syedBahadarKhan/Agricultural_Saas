import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import connectDB from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import farmsRoutes from './modules/farms/farms.routes.js';
import cropsRoutes from './modules/crops/crops.routes.js';
import diseasesRoutes from './modules/diseases/diseases.routes.js';
import marketplaceRoutes from './modules/marketplace/marketplace.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import rfqRoutes from './modules/rfq/rfq.routes.js';
import logisticsRoutes from './modules/logistics/logistics.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import uploadRoutes from './routes/uploadRoute.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/farms', farmsRoutes);
app.use('/api/v1/crops', cropsRoutes);
app.use('/api/v1/diseases', diseasesRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/rfq', rfqRoutes);
app.use('/api/v1/logistics', logisticsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/uploads', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Agricultural SaaS API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err instanceof multer.MulterError
    ? (err.code === 'LIMIT_FILE_SIZE' ? 413 : 400)
    : (err.status || (res.statusCode === 200 ? 500 : res.statusCode));
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || (statusCode === 500 ? 'SERVER_ERROR' : 'UPLOAD_ERROR'),
      message: statusCode === 500 ? 'An unexpected server error occurred.' : err.message,
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
