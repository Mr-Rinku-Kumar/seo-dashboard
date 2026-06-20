// backend/src/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: Admin123!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();