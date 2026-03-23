const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/tenant/User');
const Tenant = require('./models/superadmin/Tenant');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const findIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ role: 'employee' }).limit(1);
    const tenants = await Tenant.find({}).limit(1);
    
    if (users.length > 0 && tenants.length > 0) {
      console.log('EMPLOYEE_ID=' + users[0]._id);
      console.log('TENANT_ID=' + users[0].tenant);
    } else {
      console.log('No employees or tenants found.');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

findIds();
