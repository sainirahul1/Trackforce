const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const StoreVisit = require('../models/employee/StoreVisit');
const Dashboard = require('../models/employee/Dashboard');

const EMPLOYEE_ID = '69c0fbbe60763acca36b8dc4';
const TENANT_ID = '69c0fbbe60763acca36b8dbe';

async function seed5() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const visits = [
      {
        employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
        tenant: new mongoose.Types.ObjectId(TENANT_ID),
        storeName: 'Reliance Smart',
        status: 'completed',
        onTime: 'completed',
        isConsistent: 'consistent',
        timestamp: new Date(),
        notes: '[Efficiency: 1.0] Quick audit completed.'
      },
      {
        employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
        tenant: new mongoose.Types.ObjectId(TENANT_ID),
        storeName: 'More Supermarket',
        status: 'completed',
        onTime: 'completed',
        isConsistent: 'consistent',
        timestamp: new Date(),
        notes: '[Reliability: 1.0] Arrived on time.'
      },
      {
        employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
        tenant: new mongoose.Types.ObjectId(TENANT_ID),
        storeName: 'Big Bazaar',
        status: 'pending',
        onTime: 'delay',
        isConsistent: 'inconsistent',
        timestamp: new Date(),
        notes: '[Accuracy: 0.0] Inconsistent data reported.'
      },
      {
        employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
        tenant: new mongoose.Types.ObjectId(TENANT_ID),
        storeName: 'Star Bazaar',
        status: 'completed',
        onTime: 'completed',
        isConsistent: 'consistent',
        timestamp: new Date(),
        notes: '[Speed: 1.0] Very fast completion.'
      },
      {
        employee: new mongoose.Types.ObjectId(EMPLOYEE_ID),
        tenant: new mongoose.Types.ObjectId(TENANT_ID),
        storeName: 'Spar Hypermarket',
        status: 'completed',
        onTime: 'completed',
        isConsistent: 'consistent',
        timestamp: new Date(),
        notes: '[Engagement: 1.0] High engagement with store owner.'
      }
    ];

    await StoreVisit.insertMany(visits);
    console.log('Successfully added 5 descriptive visits.');

    // Manually set capabilities for immediate visual feedback
    const caps = [80, 80, 80, 60, 50]; // Example scores for 5 visits
    await Dashboard.findOneAndUpdate(
      { employee: new mongoose.Types.ObjectId(EMPLOYEE_ID) },
      { capabilities: caps },
      { upsert: true }
    );
    console.log(`Updated Dashboard capabilities to: ${caps.join(', ')}`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding visits:', err);
    process.exit(1);
  }
}

seed5();
