const mongoose = require('mongoose');
require('dotenv').config();

const StoreVisit = require('./models/employee/StoreVisit');
const Task = require('./models/employee/Task');

async function checkData() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI.split('@')[1] || 'URL hidden');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB');

    const visitCount = await StoreVisit.countDocuments({});
    console.log(`\n--- STORE VISITS (${visitCount}) ---`);
    const visits = await StoreVisit.find({}).limit(5);
    visits.forEach((v, i) => {
      console.log(`Visit ${i+1}:`);
      console.log(`  Store: ${v.storeName}`);
      console.log(`  Status: ${v.status}`);
      console.log(`  Photos:`, v.photos);
      console.log(`  Tenant: ${v.tenant}`);
      console.log(`  Employee: ${v.employee}`);
    });

    const taskCount = await Task.countDocuments({});
    console.log(`\n--- TASKS (${taskCount}) ---`);
    // Find tasks that have evidence
    const tasksWithEvidence = await Task.find({ 
      $or: [
        { 'evidence.storeFront': { $exists: true, $ne: null } },
        { 'evidence.selfie': { $exists: true, $ne: null } }
      ]
    }).limit(5);
    
    console.log(`Found ${tasksWithEvidence.length} tasks with evidence samples`);
    tasksWithEvidence.forEach((t, i) => {
      console.log(`Task ${i+1}: ${t.title}`);
      console.log(`  Evidence:`, JSON.stringify(t.evidence, null, 2));
    });

    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

checkData();
