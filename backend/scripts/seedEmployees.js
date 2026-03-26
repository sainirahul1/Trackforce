const mongoose = require('mongoose');
const User = require('../models/tenant/User');
const Tenant = require('../models/superadmin/Tenant');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const tenantsData = [
  { name: 'TechFlow Solutions', industry: 'Technology', company: 'TechFlow' },
  { name: 'Global Logistics Group', industry: 'Logistics', company: 'GLG' },
  { name: 'Retail Pulse Inc', industry: 'Retail', company: 'RetailPulse' },
  { name: 'EcoEnergy Corp', industry: 'Energy', company: 'EcoEnergy' }
];

const seedMultiTenantEmployees = async () => {
  try {
    // Connect to DB - assuming this script is run from backend/scripts/
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/trackforce';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    for (const data of tenantsData) {
      console.log(`\n--- Seeding for ${data.name} ---`);
      
      // 1. Create Tenant
      const tenant = await Tenant.create({
        name: data.name,
        industry: data.industry,
        onboardingStatus: 'active'
      });
      console.log(`Tenant created: ${tenant._id}`);

      // 2. Create Manager
      const managerEmail = `manager@${data.company.toLowerCase()}.com`;
      const manager = await User.create({
        name: `${data.company} Manager`,
        email: managerEmail,
        password: 'password123',
        role: 'manager',
        tenant: tenant._id,
        company: data.name,
        profile: {
          designation: 'Operations Manager',
          team: 'Central Admin',
          zone: 'Global'
        }
      });
      console.log(`Manager created: ${manager.email} (${manager._id})`);

      // 3. Create Employee
      const employeeEmail = `field@${data.company.toLowerCase()}.com`;
      const employee = await User.create({
        name: `${data.company} Field Agent`,
        email: employeeEmail,
        password: 'password123',
        role: 'employee',
        tenant: tenant._id,
        manager: manager._id,
        company: data.name,
        profile: {
          designation: 'Field Executive',
          team: 'Field Ops',
          zone: 'North',
          employeeId: `TF-${data.company.substring(0,3).toUpperCase()}-001`
        }
      });
      console.log(`Employee created: ${employee.email} (${employee._id})`);
    }

    console.log('\nAll Multi-Tenant Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedMultiTenantEmployees();
