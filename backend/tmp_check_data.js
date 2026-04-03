require('dotenv').config({path: 'c:/Users/Dell/ReatchAll/ReatchallFrntEnd/trackforce_frontend/backend/.env'});
const mongoose = require('mongoose');
const User = require('c:/Users/Dell/ReatchAll/ReatchallFrntEnd/trackforce_frontend/backend/models/tenant/User.js');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const sample = await User.findOne();
    if (sample) {
      console.log('Sample User Keys:', Object.keys(sample.toObject()));
      console.log('Sample User Profile Keys:', sample.profile ? Object.keys(sample.profile) : 'No Profile');
      console.log('Sample User Email:', sample.email);
      console.log('Sample User Phone:', sample.phone);
      console.log('Sample User Username:', sample.username);
    } else {
      console.log('No users found in collection');
    }
  } catch (err) {
    console.error('Connection Error:', err);
  } finally {
    process.exit(0);
  }
}

checkData();
