const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const checkAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.findOne({ role: 'admin' });
  if (admin) {
    console.log('Admin found:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
  } else {
    console.log('No admin found');
  }
  process.exit(0);
};

checkAdmin().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
