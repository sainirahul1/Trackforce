const mongoose = require('mongoose');
require('dotenv').config();

const StoreVisit = require('./models/employee/StoreVisit');
const Task = require('./models/employee/Task');

async function checkIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('\n--- STORE VISITS INDEXES ---');
    console.log(await StoreVisit.listIndexes());

    console.log('\n--- TASKS INDEXES ---');
    console.log(await Task.listIndexes());

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkIndexes();
