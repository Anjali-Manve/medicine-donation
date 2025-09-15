import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import DonationHistory from '../models/DonationHistory.js';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '../.env' });

// Connect to DB (temporary connection for seeding script)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Medicine.deleteMany({});
    await DonationHistory.deleteMany({});
    console.log('Existing data cleared.');

    // Create Admin User (if not already created by app.js startup)
    const adminEmail = 'anjalimanve2828@gmail.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('anjali@989', salt);
      adminUser = await User.create({
        name: 'Anjali Manve',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    // Create Donor User
    const donorPassword = 'donor@123';
    const saltDonor = await bcrypt.genSalt(10);
    const hashedDonorPassword = await bcrypt.hash(donorPassword, saltDonor);
    const donorUser = await User.create({
      name: 'Riya Sharma',
      email: 'riya.sharma@example.com',
      password: hashedDonorPassword,
      role: 'donor',
    });
    console.log('Donor user created.');

    // Create Receiver User
    const receiverPassword = 'receiver@123';
    const saltReceiver = await bcrypt.genSalt(10);
    const hashedReceiverPassword = await bcrypt.hash(receiverPassword, saltReceiver);
    const receiverUser = await User.create({
      name: 'Aman Singh',
      email: 'aman.singh@example.com',
      password: hashedReceiverPassword,
      role: 'receiver',
    });
    console.log('Receiver user created.');

    // Create Medicine entries
    const medicines = await Medicine.insertMany([
      {
        name: 'Paracetamol 500mg',
        description: 'Pain reliever',
        quantity: 50,
        expiryDate: new Date(2026, 0, 1),
        donor: donorUser._id,
      },
      {
        name: 'Amoxicillin 250mg',
        description: 'Antibiotic',
        quantity: 30,
        expiryDate: new Date(2025, 11, 15),
        donor: donorUser._id,
      },
      {
        name: 'Cough Syrup',
        description: 'Relieves cough',
        quantity: 10,
        expiryDate: new Date(2025, 9, 30),
        donor: donorUser._id,
      },
      {
        name: 'Ibuprofen 200mg Tablets',
        description: 'Anti-inflammatory and pain reliever',
        quantity: 100,
        expiryDate: new Date(2027, 5, 20),
        donor: donorUser._id,
      },
      {
        name: 'Vitamin C 1000mg Tablets',
        description: 'Immune support',
        quantity: 60,
        expiryDate: new Date(2026, 8, 10),
        donor: donorUser._id,
      },
    ]);
    console.log('Medicine data created.');

    // Create Donation History entries
    await DonationHistory.insertMany([
      {
        donor: donorUser._id,
        receiver: receiverUser._id,
        medicine: medicines[0]._id,
        quantity: 5,
        donationDate: new Date(),
      },
      {
        donor: donorUser._id,
        receiver: receiverUser._id,
        medicine: medicines[1]._id,
        quantity: 2,
        donationDate: new Date(Date.now() - 86400000), // 1 day ago
      },
    ]);
    console.log('Donation history created.');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
