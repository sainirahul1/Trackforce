const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/tenant/User');

async function fixUserRoles() {
  try {
    console.log('--- STARTING ROLE CORRRECTION MIGRATION ---');
    console.log('Connecting to Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.\n');

    const names = ['uv', 'uma maheshwarii', 'chand'];
    
    console.log(`Searching for users: ${names.join(', ')}...`);
    
    // Find all users matching these names
    const users = await User.find({ 
      name: { $in: names.map(n => new RegExp(n, 'i')) } 
    });

    if (users.length === 0) {
      console.log('No users found with those names.');
      process.exit(0);
    }

    console.log(`Found ${users.length} matching users. Aligning roles to 'employee'...\n`);

    const result = await User.updateMany(
      { _id: { $in: users.map(u => u._id) } },
      { $set: { role: 'employee' } }
    );

    console.log(`✅ Roles updated: ${result.modifiedCount}`);
    
    // Verification log
    const updatedUsers = await User.find({ _id: { $in: users.map(u => u._id) } });
    updatedUsers.forEach(u => {
      console.log(`- ${u.name}: Role = ${u.role}`);
    });

    console.log('\n--- ROLE MIGRATION COMPLETE ---');
    process.exit(0);
  } catch (err) {
    console.error('CRITICAL MIGRATION ERROR:', err);
    process.exit(1);
  }
}

fixUserRoles();
