const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/tenant/User');

dotenv.config();

const users = [
  {
    name: 'Platform Admin',
    email: 'superadmin@trackforce.com',
    password: 'admin123',
    role: 'superadmin',
    company: 'TrackForce',
  },
  {
    name: 'Company Admin',
    email: 'tenant@company.com',
    password: 'tenant123',
    role: 'tenant',
    company: 'Acme Corp',
  },
  {
    name: 'Team Manager',
    email: 'manager@company.com',
    password: 'manager123',
    role: 'manager',
    company: 'Acme Corp',
  },
  {
    name: 'Field Executive',
    email: 'employee@company.com',
    password: 'employee123',
    role: 'employee',
    company: 'Acme Corp',
  },
];

const companies = [
  { name: 'ReatchAll', plan: 'enterprise' },
  { name: 'MetaLogistics', plan: 'premium' },
  { name: 'SwiftDelivery', plan: 'basic' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing data
    await User.deleteMany({});
    const Tenant = require('./models/superadmin/Tenant');
    const StoreVisit = require('./models/employee/StoreVisit');
    const Order = require('./models/employee/Order');
    const Location = require('./models/employee/Location');
    const ActivityLog = require('./models/employee/ActivityLog');

    await Tenant.deleteMany({});
    await StoreVisit.deleteMany({});
    await Order.deleteMany({});
    await Location.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log('Cleared all existing database records.');

    // 2. Create Global SuperAdmin
    await User.create({
      name: 'Super Admin',
      company: 'Platform',
      email: 'superadmin@trackforce.com',
      password: 'admin123',
      role: 'superadmin',
    });
    console.log('Created Global SuperAdmin.');

    // 3. Create Organizations and their Users
    for (const comp of companies) {
      const tenant = await Tenant.create({
        name: comp.name,
        subscription: { plan: comp.plan, status: 'active' }
      });

      const companySlug = comp.name.toLowerCase().replace(/\s/g, '');

      // Create Tenant Admin
      const admin = await User.create({
        name: `${comp.name} Admin`,
        company: comp.name,
        email: `admin@${companySlug}.com`,
        password: 'password123',
        role: 'tenant',
        tenant: tenant._id,
      });

      // Create Manager
      const manager = await User.create({
        name: `${comp.name} Manager`,
        company: comp.name,
        email: `manager@${companySlug}.com`,
        password: 'password123',
        role: 'manager',
        tenant: tenant._id,
      });

      // Create Employee
      const employee = await User.create({
        name: `${comp.name} Employee`,
        company: comp.name,
        email: `employee@${companySlug}.com`,
        password: 'password123',
        role: 'employee',
        tenant: tenant._id,
        manager: manager._id,
      });

      // 4. Create Mock Operational Data for this tenant
      await StoreVisit.create({
        employee: employee._id,
        tenant: tenant._id,
        storeName: `${comp.name} Partner Store A`,
        status: 'completed',
        gps: { lat: 12.9716, lng: 77.5946 },
        notes: `Regular visit for ${comp.name}`,
      });

      await Order.create({
        employee: employee._id,
        tenant: tenant._id,
        storeName: `${comp.name} Partner Store A`,
        items: [{ name: 'Standard Kit', quantity: 5, price: 100 }],
        totalAmount: 500,
        status: 'delivered',
      });

      await Location.create({
        user: employee._id,
        tenant: tenant._id,
        coords: { lat: 12.9716, lng: 77.5946 },
      });

      await ActivityLog.create({
        user: employee._id,
        tenant: tenant._id,
        type: 'visit_start',
        details: `Started visit at ${comp.name} Partner Store A`,
      });

      console.log(`Seeded accounts and isolated mock data for ${comp.name}.`);
    }

    console.log('\nSuccessfully seeded 10 accounts and unique data for 3 organizations.');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
