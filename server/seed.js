const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'admin@engineera.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit();
  }

  await User.create({
    name: 'Admin',
    email: 'admin@engineera.com',
    password: 'admin123456',
    role: 'admin',
  });

  console.log('Admin created successfully');
  console.log('Email: admin@engineera.com');
  console.log('Password: admin123456');
  process.exit();
};

seedAdmin();