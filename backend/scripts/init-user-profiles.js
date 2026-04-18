const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/tenant/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const initializeProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Integrity Check...');

    const users = await User.find({});
    console.log(`Auditing ${users.length} users...`);

    let updatedCount = 0;

    for (const user of users) {
      let needsUpdate = false;

      // Ensure profile exists
      if (!user.profile) {
        user.profile = {};
        needsUpdate = true;
      }

      // Ensure verifiedDocuments array exists
      if (!user.profile.verifiedDocuments) {
        user.profile.verifiedDocuments = [];
        needsUpdate = true;
      }

      // Ensure employeeCode exists (fallback to auto-generated if missing)
      if (!user.profile.employeeCode && (user.role === 'employee' || user.role === 'manager')) {
        const prefix = user.role === 'manager' ? 'MGR' : 'EXE';
        const randomStr = Math.random().toString(36).substring(7).toUpperCase();
        user.profile.employeeCode = `TF-${prefix}-${randomStr}`;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await user.save();
        updatedCount++;
      }
    }

    console.log(`Success: ${updatedCount} users patched with structured profiles.`);
    process.exit(0);
  } catch (error) {
    console.error('Integrity Check Failed:', error);
    process.exit(1);
  }
};

initializeProfiles();
