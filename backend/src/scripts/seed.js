import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import Farm from '../models/farm.model.js';
import Crop from '../models/crop.model.js';
import Disease from '../models/disease.model.js';
import Listing from '../models/listing.model.js';
import Order from '../models/order.model.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrisaas');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    
    // Clear all existing data
    await Order.deleteMany();
    await Listing.deleteMany();
    await Disease.deleteMany();
    await Crop.deleteMany();
    await Farm.deleteMany();
    await User.deleteMany();

    console.log('Cleared existing data.');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const farmer = await User.create({
      firstName: 'Ahmad',
      lastName: 'Khan',
      email: 'ahmad@farmer.com',
      password,
      role: 'FARMER',
      phone: '03001234567'
    });

    const buyer = await User.create({
      firstName: 'Ali',
      lastName: 'Trader',
      email: 'ali@buyer.com',
      password,
      role: 'BUYER',
      phone: '03111234567'
    });

    console.log('Created Users.');

    // 2. Create Farms
    const farm = await Farm.create({
      owner: farmer._id,
      name: 'Khan Family Farm',
      location: {
        district: 'Peshawar',
        address: 'Charsadda Road, Peshawar',
        coordinates: { lat: 34.0151, lng: 71.5249 }
      },
      totalArea: 10,
      areaUnit: 'Acre'
    });

    console.log('Created Farm.');

    // 3. Create Crops
    const crop1 = await Crop.create({
      owner: farmer._id,
      farm: farm._id,
      name: 'Tomato (Roma)',
      type: 'VEGETABLE',
      variety: 'Roma',
      areaPlanted: 2,
      areaUnit: 'Acre',
      cycle: {
        stage: 'GROWING',
        plantedDate: new Date('2026-07-01'),
        expectedHarvestDate: new Date('2026-10-15')
      }
    });

    const crop2 = await Crop.create({
      owner: farmer._id,
      farm: farm._id,
      name: 'Wheat (Winter)',
      type: 'CEREAL',
      variety: 'Winter',
      areaPlanted: 8,
      areaUnit: 'Acre',
      cycle: {
        stage: 'PLANNING',
        expectedHarvestDate: new Date('2027-04-15')
      }
    });

    console.log('Created Crops.');

    // 4. Create Diseases
    await Disease.create({
      name: 'Late Blight',
      category: 'FUNGAL',
      affectedCrops: ['Tomato', 'Potato'],
      causes: 'Caused by the oomycete Phytophthora infestans. Favored by cool, wet weather.',
      symptoms: ['Dark lesions on leaves', 'White fuzzy mold on undersides', 'Brown spots on fruit'],
      severity: 'SEVERE',
      treatments: [
        {
          name: 'Fungicide Application (Chlorothalonil)',
          description: 'Apply protectant fungicides like chlorothalonil immediately.',
          type: 'CHEMICAL',
          effectiveness: 'HIGH'
        },
        {
          name: 'Destroy Infected Plants',
          description: 'Remove and destroy affected plants to prevent spread.',
          type: 'CULTURAL',
          effectiveness: 'MEDIUM'
        }
      ]
    });
    
    await Disease.create({
      name: 'Powdery Mildew',
      category: 'FUNGAL',
      affectedCrops: ['Wheat', 'Tomato', 'Cucumber'],
      causes: 'Various fungi. Favored by high humidity and moderate temperatures.',
      symptoms: ['White powdery spots on leaves and stems', 'Yellowing leaves'],
      severity: 'MODERATE',
      treatments: [
        {
          name: 'Sulfur Fungicide',
          description: 'Apply sulfur-based fungicides.',
          type: 'CHEMICAL',
          effectiveness: 'HIGH'
        }
      ]
    });

    console.log('Created Diseases.');

    // 5. Create Listings
    const listing = await Listing.create({
      farmer: farmer._id,
      crop: crop1._id,
      title: 'Premium Roma Tomatoes - Fresh Harvest',
      cropType: 'Tomato',
      grade: 'A',
      quantityAvailable: 500,
      quantityUnit: 'KG',
      pricePerUnit: 120,
      location: { district: 'Peshawar' },
      expectedHarvestDate: new Date('2026-10-15'),
      status: 'ACTIVE'
    });
    
    const listing2 = await Listing.create({
      farmer: farmer._id,
      crop: crop2._id,
      title: 'Winter Wheat Bulk Order',
      cropType: 'Wheat',
      grade: 'STANDARD',
      quantityAvailable: 10000,
      quantityUnit: 'KG',
      pricePerUnit: 100,
      location: { district: 'Peshawar' },
      status: 'ACTIVE'
    });

    console.log('Created Listings.');

    // 6. Create Order
    await Order.create({
      buyer: buyer._id,
      seller: farmer._id,
      listing: listing._id,
      quantity: 100,
      unitPrice: 120,
      totalPrice: 12000,
      status: 'PENDING',
      deliveryDetails: {
        address: 'Main Market, Rawalpindi',
        expectedDeliveryDate: new Date('2026-10-18')
      }
    });

    console.log('Created Order.');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
