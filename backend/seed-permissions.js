const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Permission = require('./models/superadmin/Permission');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const defaultPermissions = [
  { module: 'Global System Settings', superAdmin: true, tenant: true, manager: false, employee: false },
  { module: 'Organization Management', superAdmin: true, tenant: true, manager: false, employee: false },
  { module: 'User Role Governance', superAdmin: true, tenant: true, manager: false, employee: false },
  { module: 'Team Hierarchy View', superAdmin: true, tenant: true, manager: true, employee: false },
  { module: 'Live Team Tracking (GPS)', superAdmin: true, tenant: true, manager: true, employee: false },
  { module: 'Route Path Optimization', superAdmin: true, tenant: true, manager: true, employee: false },
  { module: 'Geofencing & Alerts', superAdmin: true, tenant: true, manager: true, employee: false },
  { module: 'Store Visits & Evidence', superAdmin: true, tenant: true, manager: true, employee: true },
  { module: 'Platform Wide Analytics', superAdmin: true, tenant: false, manager: false, employee: false },
  { module: 'Audit Logs & Security', superAdmin: true, tenant: true, manager: false, employee: false },
  { module: 'Support Ticket Helpdesk', superAdmin: true, tenant: true, manager: true, employee: true },
  { module: 'Dispute & Resolution', superAdmin: true, tenant: true, manager: true, employee: false },
];

const seedPermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    for (const p of defaultPermissions) {
      await Permission.findOneAndUpdate(
        { module: p.module },
        p,
        { upsert: true, new: true }
      );
    }

    console.log('Permissions seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedPermissions();
