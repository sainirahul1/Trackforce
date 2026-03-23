const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/employee/Task');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const checkTenants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const tasks = await Task.find({});
    console.log(JSON.stringify(tasks.map(t => ({ title: t.title, tenant: t.tenant, employee: t.employee })), null, 2));
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkTenants();
