const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/tenant/User');

async function fixUserStatuses() {
  try {
    console.log('--- STARTING DATABASE STATUS ALIGNMENT ---');
    console.log('Connecting to Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.\n');

    // Find all users with lowercase 'active' status
    const usersToFix = await User.find({ status: 'active' });

    if (usersToFix.length === 0) {
      console.log('No users found with lowercase "active" status. All statuses are already aligned.');
      process.exit(0);
    }

    console.log(`Found ${usersToFix.length} users with lowercase "active" status. Correcting now...\n`);

    const result = await User.updateMany(
      { status: 'active' },
      { $set: { status: 'Active' } }
    );

    console.log(`✅ Corrected users: ${result.modifiedCount}`);
    console.log('--- DATABASE ALIGNMENT COMPLETE ---');
    process.exit(0);
  } catch (err) {
    console.error('CRITICAL ALIGNMENT ERROR:', err);
    process.exit(1);
  }
}

fixUserStatuses();
