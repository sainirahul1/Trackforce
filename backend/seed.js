const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/tenant/User');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

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
  { name: 'ReatchAll', plan: 'enterprise', industry: 'Logistics', logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501c27?w=100&h=100&fit=crop' },
  { name: 'MetaLogistics', plan: 'premium', industry: 'Supply Chain', logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop' },
  { name: 'SwiftDelivery', plan: 'basic', industry: 'E-commerce', logo: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop' }
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
const Subscription = require('./models/superadmin/Subscription');
const SystemSetting = require('./models/superadmin/SystemSetting');
const PlatformMetric = require('./models/superadmin/PlatformMetric');
const Notification = require('./models/tenant/Notification');
    await Tenant.deleteMany({});
    await StoreVisit.deleteMany({});
    await Order.deleteMany({});
    await Location.deleteMany({});
    await ActivityLog.deleteMany({});
    await Subscription.deleteMany({});
    await SystemSetting.deleteMany({});
    await PlatformMetric.deleteMany({});
    console.log('Cleared all existing database records.');

    // New: Seed Platform Metrics for Dashboard
    await PlatformMetric.insertMany([
      {
        type: 'global_metric',
        data: {
          dataProcessed: '5.2 TB',
          globalRegions: '12',
          securityScore: 'A+'
        }
      },
      {
        type: 'system_health',
        data: {
          apiGateway: { status: 'OPERATIONAL', value: 100 },
          storageClusters: { status: '78% CAPACITY', value: 78 },
          authServices: { status: 'STABLE', value: 100 }
        }
      }
    ]);
    console.log('Created Platform Metrics.');

    // 2. Create Global Subscriptions
    const subs = await Subscription.insertMany([
      {
        name: 'Basic',
        price: '49',
        description: 'Ideal for small startups or local agencies.',
        features: ['Up to 10 Employees', 'Basic GPS Tracking', 'Daily Reports', 'Email Support'],
        employeeLimit: 10,
        icon: 'Zap',
        color: 'blue'
      },
      {
        name: 'Premium',
        price: '149',
        description: 'Best for growing businesses with multiple teams.',
        features: ['Up to 50 Employees', 'Real-time Tracking', 'Advanced Analytics', 'Priority Support', 'Geo-fencing'],
        employeeLimit: 50,
        isPopular: true,
        icon: 'Shield',
        color: 'indigo'
      },
      {
        name: 'Enterprise',
        price: '499',
        description: 'Full-featured solution for large organizations.',
        features: ['Unlimited Employees', 'White-labeling', 'API Access', 'Dedicated Manager', 'Custom Integration'],
        employeeLimit: 1000,
        icon: 'Crown',
        color: 'purple'
      }
    ]);
    console.log('Created Subscription Plans.');

    // 3. Create Global Settings
    await SystemSetting.create({
      platformName: 'TrackForce SaaS',
      currency: 'USD',
      maintenanceMode: false,
      globalNotifications: true,
      integrations: {
        googleMaps: { status: 'inactive' }
      }
    });
    console.log('Created System Settings.');

    // 4. Create Global SuperAdmin (in tenant.users collection)
    await User.create({
      name: 'Super Admin',
      email: 'superadmin@trackforce.com',
      company: 'TrackForce',
      password: 'admin123',
      role: 'superadmin'
    });
    console.log('Created Global SuperAdmin (in tenant.users).');

    // 3. Create Organizations and their Users
    for (const comp of companies) {
      const subscription = subs.find(s => s.name.toLowerCase() === comp.plan.toLowerCase());
      
      const tenant = await Tenant.create({
        name: comp.name,
        industry: comp.industry,
        subscription: { 
          planId: subscription ? subscription._id : null,
          plan: comp.plan, 
          status: 'active', 
          employeeLimit: subscription ? subscription.employeeLimit : (comp.plan === 'enterprise' ? 1000 : 50)
        },
        settings: { logo: comp.logo }
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
