import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agrisaas');
    const res = await User.updateMany(
      { accountStatus: { $in: [null, 'PENDING_REVIEW', undefined] } },
      { $set: { accountStatus: 'APPROVED' } }
    );
    console.log('Updated users:', res);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

run();
