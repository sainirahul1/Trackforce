const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Tenant = require('./models/superadmin/Tenant');
const User = require('./models/tenant/User');
const Subscription = require('./models/superadmin/Subscription');

dotenv.config({ path: '.env' });

const testGetAllTenants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    console.log('Fetching tenants and populating...');
    const tenants = await Tenant.find().sort({ createdAt: -1 }).populate('subscription.planId').lean();
    console.log(`Found ${tenants.length} tenants.`);

    const enrichedTenants = await Promise.all(
      tenants.map(async (tenant) => {
        try {
          const [userCount, managerCount, employeeCount] = await Promise.all([
            User.countDocuments({ tenant: tenant._id }),
            User.countDocuments({ tenant: tenant._id, role: 'manager' }),
            User.countDocuments({ tenant: tenant._id, role: 'employee' })
          ]);
          return { ...tenant, userCount, managerCount, employeeCount };
        } catch (err) {
          console.error(`Error enriching tenant ${tenant._id}:`, err.message);
          throw err;
        }
      })
    );

    const totalOrganizations = enrichedTenants.length;
    const activeOrganizations = enrichedTenants.filter(t => t.onboardingStatus === 'active').length;
    const globalWorkforceNodes = enrichedTenants.reduce((sum, t) => sum + (t.userCount || 0), 0);
    
    // Check for division by zero or bad limits
    const avgUtilization = enrichedTenants.length ? 
      (enrichedTenants.reduce((sum, t) => {
        const limit = t.subscription?.employeeLimit || 50;
        const count = t.userCount || 0;
        return sum + (count / limit);
      }, 0) / enrichedTenants.length * 100).toFixed(1) : '0.0';

    console.log('Stats:', {
      totalOrganizations,
      activeOrganizations,
      globalWorkforceNodes,
      avgUtilization
    });

    process.exit(0);
  } catch (err) {
    console.error('FAILED test:', err);
    process.exit(1);
  }
};

testGetAllTenants();
