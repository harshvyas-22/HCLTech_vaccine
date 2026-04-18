const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const updateAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  let admin = await User.findOne({ role: 'admin' });
  
  if (!admin) {
    admin = await User.create({
      name: 'Admin User',
      email: 'admin@hospital.com',
      password: 'Admin@12345',
      phone: '9999999999',
      role: 'admin',
      dateOfBirth: new Date('1990-01-15'),
      isEmailVerified: true,
    });
    console.log('Created new admin account');
  } else {
    admin.password = 'Admin@12345';
    admin.isEmailVerified = true;
    await admin.save();
    console.log('Updated existing admin account');
  }
  
  console.log('\nAdmin Credentials:');
  console.log('Email:', admin.email);
  console.log('Password: Admin@12345');
  process.exit(0);
};

updateAdmin().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
