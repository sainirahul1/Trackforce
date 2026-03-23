const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/tenant/User');
const StoreVisit = require('./models/employee/StoreVisit');

async function checkUserAndVisits() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Assuming the user logged in is the first employee found in seed or similar
    const employees = await User.find({ role: 'employee' });
    console.log(`\n--- EMPLOYEES (${employees.length}) ---`);
    employees.forEach(u => {
      console.log(`Emp: ${u.name} (${u.email}) | Tenant: ${u.tenant} | ID: ${u._id}`);
    });

    const visitCountByTenant = await StoreVisit.aggregate([
      { $group: { _id: "$tenant", count: { $sum: 1 } } }
    ]);
    console.log('\n--- VISITS BY TENANT ---');
    console.log(visitCountByTenant);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUserAndVisits();
