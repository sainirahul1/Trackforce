const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const StoreVisit = require('../models/employee/StoreVisit');
const Dashboard = require('../models/employee/Dashboard');
const User = require('../models/tenant/User');

const EMPLOYEE_ID = '69c0fbbe60763acca36b8dc4';
const TENANT_ID = '69c0fbbe60763acca36b8dbe';

const mode = process.argv[2] || 'poor'; // 'poor' or 'excellent'

async function validate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected. Mode: ${mode.toUpperCase()}`);

    // Clear existing visits for this employee
    await StoreVisit.deleteMany({ employee: new mongoose.Types.ObjectId(EMPLOYEE_ID) });

    const visits = [];
    for (let i = 0; i < 20; i++) {
       if (mode === 'poor') {
         visits.push({
           employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
           tenant: new mongoose.Types.ObjectId(TENANT_ID),
           storeName: 'Test Store',
           status: 'rejected',
           onTime: 'delay',
           isConsistent: 'inconsistent',
           timestamp: new Date(),
           createdAt: new Date(),
           notes: 'Poor performance test'
         });
       } else {
         visits.push({
           employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
           tenant: new mongoose.Types.ObjectId(TENANT_ID),
           storeName: 'Test Store',
           status: 'completed',
           onTime: 'completed',
           isConsistent: 'consistent',
           timestamp: new Date(),
           createdAt: new Date(),
           notes: 'Excellent performance test'
         });
       }
    }

    await StoreVisit.insertMany(visits);
    console.log(`Inserted 20 ${mode} visits.`);

    // Trigger capability re-calculation (we'll just use the same logic as the controller)
    const total = visits.length;
    let caps = [0, 0, 0, 0, 0];
    
    if (mode === 'excellent') {
       caps = [100, 100, 100, 100, 10]; // Engagement limited to 1 store here = 1/10 = 10%
    } else {
       caps = [0, 0, 40, 0, 10]; // Speed is 0.4 if delayed within hours -> 40
    }

    await Dashboard.findOneAndUpdate(
      { employee: new mongoose.Types.ObjectId(EMPLOYEE_ID) },
      { capabilities: caps },
      { upsert: true }
    );

    console.log(`Updated Dashboard capabilities to: ${caps.join(', ')}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

validate();
