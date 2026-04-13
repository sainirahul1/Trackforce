const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/tenant/User');

// Demo accounts to reset — password will be set to match the email
const DEMO_ACCOUNTS = [
  { email: 'superadmin@trackforce.com', role: 'superadmin' },
  { email: 'manager@gmail.com',         role: 'manager'    },
  { email: 'employee2@gmail.com',       role: 'employee'   },
  { email: 'tenant@reatchall.com',      role: 'tenant'     },
];

async function resetPasswords() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.\n');

  for (const { email, role } of DEMO_ACCOUNTS) {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌  ${email} — NOT FOUND in DB`);
      continue;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(email, salt); // password == email
    await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
    console.log(`✅  ${email} (${role}) — password reset to: ${email}`);
  }

  console.log('\nDone.');
  process.exit(0);
}

resetPasswords().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
