const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/tenant/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const REACHALL_TENANT_ID = '69c0fbbe60763acca36b8dbe';
const REACHALL_MANAGER_ID = '69c0fbbe60763acca36b8dc0';

const newEmployees = [
  {
    name: 'ReatchAll Employee 2',
    email: 'employee2@reatchall.com',
    password: 'password123',
    role: 'employee',
    company: 'ReatchAll',
    tenant: REACHALL_TENANT_ID,
    manager: REACHALL_MANAGER_ID
  },
  {
    name: 'ReatchAll Employee 3',
    email: 'employee3@reatchall.com',
    password: 'password123',
    role: 'employee',
    company: 'ReatchAll',
    tenant: REACHALL_TENANT_ID,
    manager: REACHALL_MANAGER_ID
  },
  {
    name: 'ReatchAll Employee 4',
    email: 'employee4@reatchall.com',
    password: 'password123',
    role: 'employee',
    company: 'ReatchAll',
    tenant: REACHALL_TENANT_ID,
    manager: REACHALL_MANAGER_ID
  }
];

const main = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    for (const emp of newEmployees) {
      const existing = await User.findOne({ email: emp.email });
      if (existing) {
        console.log(`User ${emp.email} already exists, skipping.`);
        continue;
      }
      await User.create(emp);
      console.log(`Created employee: ${emp.email}`);
    }

    console.log('Finished creating employees.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

main();
