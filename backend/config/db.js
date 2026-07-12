const mongoose = require('mongoose');
const { Admin } = require('../models');
const bcrypt = require('bcryptjs');

// Seeds the default admin account if the database table is empty
const seedAdmin = async () => {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'adminpassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      username,
      password: hashedPassword
    });
    console.log(`Admin account seeded with username: ${username}`);
  }
};

// Establishes database connection
const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/seatallocation';

  try {
    console.log('Connecting to primary MongoDB URI...');
    const conn = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected (Primary): ${conn.connection.host}`);
    await seedAdmin();
  } catch (error) {
    console.warn(`Primary MongoDB connection failed: ${error.message}`);
    console.log(`Attempting fallback to local MongoDB instance: ${fallbackUri}...`);
    try {
      const conn = await mongoose.connect(fallbackUri);
      console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
      await seedAdmin();
    } catch (fallbackError) {
      console.error(`Local MongoDB connection also failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
