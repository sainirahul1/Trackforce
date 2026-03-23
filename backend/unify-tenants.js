const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/employee/Task');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const unifyTenants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Move all tasks to the tenant that the current user belongs to
    const result = await Task.updateMany({}, { 
      tenant: '69c0fbbe60763acca36b8dbe' 
    });
    console.log(`Updated ${result.modifiedCount} tasks to tenant 69c0fbbe60763acca36b8dbe`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

unifyTenants();
