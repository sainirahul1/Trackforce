const mongoose = require('mongoose');
const User = require('../models/tenant/User');
const Tenant = require('../models/superadmin/Tenant');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedTestAccounts = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/trackforce';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // 1. Find ReatchAll Tenant
    const tenant = await Tenant.findOne({ name: /ReatchAll/i });
    if (!tenant) {
      console.error('ReatchAll tenant not found! Please create it first.');
      process.exit(1);
    }
    console.log(`Using Tenant: ${tenant.name} (${tenant._id})`);

    const testAccounts = [
      {
        name: 'ReatchAll Tenant Admin',
        email: 'tenant@reatchall.com',
        role: 'tenant',
        company: tenant.name,
      },
      {
        name: 'ReatchAll Manager 1',
        email: 'manager1@reatchall.com',
        role: 'manager',
        company: tenant.name,
      },
      {
        name: 'ReatchAll Employee 1',
        email: 'employee1@reatchall.com',
        role: 'employee',
        company: tenant.name,
      }
    ];

    for (const account of testAccounts) {
      let user = await User.findOne({ email: account.email });
      
      if (user) {
        user.name = account.name;
        user.password = 'password123'; // Plain text, will be hashed by pre-save hook
        user.role = account.role;
        user.tenant = tenant._id;
        user.company = account.company;
        user.profile = {
          designation: account.role === 'tenant' ? 'Organization Admin' : (account.role === 'manager' ? 'Regional Manager' : 'Field Executive'),
          department: 'Operations',
          location: 'Bangalore, India'
        };
      } else {
        user = new User({
          ...account,
          password: 'password123',
          tenant: tenant._id,
          profile: {
            designation: account.role === 'tenant' ? 'Organization Admin' : (account.role === 'manager' ? 'Regional Manager' : 'Field Executive'),
            department: 'Operations',
            location: 'Bangalore, India'
          }
        });
      }
      
      await user.save();
      console.log(`Updated/Created ${account.role.toUpperCase()}: ${user.email}`);
    }

    console.log('\nTest Accounts Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedTestAccounts();
