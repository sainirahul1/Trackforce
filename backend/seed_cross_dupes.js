const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load Models
const User = require('./models/tenant/User');
const Tenant = require('./models/superadmin/Tenant');
const Subscription = require('./models/superadmin/Subscription');

const seedDuplicates = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database cluster...');

    // Clean up any existing diagnostic data to keep it fresh
    await User.deleteMany({ name: 'Bahadur Duplicate' });
    await Tenant.deleteMany({ name: 'Titan Corp' });
    await Subscription.deleteMany({ name: { $in: ['Enterprise Alpha', 'Enterprise Beta'] } });

    // 1. Create 3 duplicate Users (Identity Conflict - Same Name, Different Email)
    const userDups = [
      {
        name: 'Bahadur Duplicate',
        company: 'DIAGNOSTIC_LAB',
        email: 'bahadur_alpha@test.com',
        role: 'manager',
        password: 'password123',
        profile: { 
          phone: '9998881111',
          address: '123 Test Street, Bangalore'
        }
      },
      {
        name: 'Bahadur Duplicate',
        company: 'DIAGNOSTIC_LAB',
        email: 'bahadur_beta@test.com',
        role: 'employee',
        password: 'password123',
        profile: { 
          phone: '9998881111', // Duplicate Phone for custom test
          address: '123 Test Street, Bangalore' // Duplicate Address for custom test
        }
      },
      {
        name: 'Bahadur Duplicate',
        company: 'DIAGNOSTIC_LAB',
        email: 'bahadur_gamma@test.com',
        role: 'employee',
        password: 'password123',
        profile: { 
          phone: '9998881111', // Duplicate Phone for custom test
          address: '123 Test Street, Bangalore' // Duplicate Address for custom test
        }
      }
    ];

    // 2. Create 3 duplicate Tenants (Identity Conflict - Same Name, Different Domain)
    const tenantDups = [
      {
        name: 'Titan Corp',
        domain: 'titan.alpha.com',
        onboardingStatus: 'active',
        subscription: { plan: 'Premium' }
      },
      {
        name: 'Titan Corp',
        domain: 'titan.beta.com',
        onboardingStatus: 'pending',
        subscription: { plan: 'Basic' }
      },
      {
        name: 'Titan Corp',
        domain: 'titan.gamma.com',
        onboardingStatus: 'pending',
        subscription: { plan: 'Standard' }
      }
    ];

    console.log('--- Injecting 3-Node Collision Diagnostic Data (Custom Ready) ---');
    
    try {
      const uResult = await User.insertMany(userDups);
      console.log(`[Users] ${uResult.length} naming/address collisions injected.`);
    } catch (e) {
      console.error('[Users Seed Error]', e.message);
    }


    try {
      const tResult = await Tenant.insertMany(tenantDups);
      console.log(`[Tenants] ${tResult.length} naming collisions injected.`);
    } catch (e) {
      console.error('[Tenants Seed Error]', e.message);
    }


    console.log('\n--- Seeding Complete. Scan the Database for "Unique Username" collisions. ---');
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL SEED ERROR:', error.message);
    process.exit(1);
  }
};

seedDuplicates();



