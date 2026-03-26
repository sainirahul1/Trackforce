const mongoose = require('mongoose');
const User = require('../models/tenant/User');
const Tenant = require('../models/superadmin/Tenant');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedReatchallStaff = async () => {
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

    const managers = [];

    // 2. Create/Update Managers (4 to 13)
    for (let i = 4; i <= 13; i++) {
      const email = `manager${i}@reatchall.com`;
      const manager = await User.findOneAndUpdate(
        { email },
        {
          name: `ReatchAll Manager ${i}`,
          password: 'password123', // Note: pre-save hook will hash this if it changes
          role: 'manager',
          tenant: tenant._id,
          company: tenant.name,
          profile: {
            designation: 'Staff Manager',
            team: `Management Team ${i}`,
            zone: 'Central'
          }
        },
        { upsert: true, new: true, runValidators: true }
      );
      managers.push(manager);
      console.log(`Updated/Created Manager: ${manager.email}`);
    }

    // 3. Create/Update Employees (linked to the managers)
    for (let i = 4; i <= 13; i++) {
      const index = i - 4;
      const email = `employee${i}@reatchall.com`;
      const employee = await User.findOneAndUpdate(
        { email },
        {
          name: `ReatchAll Employee ${i}`,
          password: 'password123',
          role: 'employee',
          tenant: tenant._id,
          manager: managers[index]._id,
          company: tenant.name,
          profile: {
            designation: 'Field Executive',
            team: `Execution Team ${i}`,
            zone: 'North',
            employeeId: `RA-EMP-00${i}`
          }
        },
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`Updated/Created Employee: ${employee.email} (Reporting to: ${managers[index].name})`);
    }

    console.log('\nReatchAll Staff Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedReatchallStaff();
