import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/user.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@agrisaas.com' });
    if (adminExists) {
      await User.deleteOne({ email: 'admin@agrisaas.com' });
      console.log('Deleted existing admin account.');
    }

    await User.create({
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@agrisaas.com',
      password: 'admin123',
      role: 'ADMIN',
      phone: '00000000000',
      accountStatus: 'APPROVED'
    });

    console.log('Admin account created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
