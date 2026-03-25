const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { getDashboardStats, getInventory } = require('./controllers/manager/inventoryOrderController');
const User = require('./models/tenant/User');

dotenv.config();

const runTest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const manager = await User.findOne({ role: 'manager' });
    if (!manager) {
      console.log('No manager found');
      process.exit(1);
    }
    console.log('Testing for Manager:', manager.email, 'Tenant:', manager.tenant);

    const req = { user: { tenant: manager.tenant }, query: {} };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status ${code}:`, JSON.stringify(data, null, 2));
        }
      })
    };

    console.log('\n--- Testing getDashboardStats ---');
    await getDashboardStats(req, res);

    console.log('\n--- Testing getInventory ---');
    await getInventory(req, res);

    process.exit(0);
  } catch (err) {
    console.error('Test Error:', err);
    process.exit(1);
  }
};

runTest();
