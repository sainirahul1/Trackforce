require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const EmployeeLogVisit = require('../models/employee/EmployeeLogVisit');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await EmployeeLogVisit.deleteMany({ 
    storeName: /supermarket/i, 
    createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } 
  });
  console.log('CLEANUP COMPLETE: ' + JSON.stringify(result));
  process.exit(0);
}

cleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
