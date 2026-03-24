const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const StoreVisit = require('../models/employee/StoreVisit');

async function clearVisits() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const result = await StoreVisit.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} visits from employee.store_visits.`);

    process.exit(0);
  } catch (err) {
    console.error('Error clearing visits:', err);
    process.exit(1);
  }
}

clearVisits();
