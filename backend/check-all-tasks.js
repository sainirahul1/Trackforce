const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/employee/Task');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const checkAllTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const tasks = await Task.find({});
    console.log('Total Tasks in DB:', tasks.length);
    tasks.forEach(t => {
      console.log(`- ${t.title} (${t.store}) - Employee: ${t.employee}`);
    });
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAllTasks();
