const mongoose = require('mongoose');
const User = require('./backend/models/tenant/User');
const Task = require('./backend/models/employee/Task');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const employeeId = '69c0fbbe60763acca36b8dc4';
    const tenantId = '69c0fbbe60763acca36b8dbe';
    const managerId = '69c0fbbe60763acca36b8dc0';

    // 1. Ensure employee is NOT tracking initially (to test toggle)
    await User.findByIdAndUpdate(employeeId, { isTracking: false });

    // 2. Create some sample tasks for this employee
    await Task.deleteMany({ employee: employeeId });

    const tasks = [
      {
        title: 'Store Inventory Audit',
        store: 'Big Bazaar Central',
        companyName: 'Future Group Retail',
        companyContact: 'Rajesh Kumar',
        companyEmail: 'ops@futuregroup.in',
        companyInsight: 'Premium Partner • 12 Months',
        address: 'MG Road, Bengaluru',
        distance: '1.2 km',
        distanceVal: 1.2,
        eta: '20 mins',
        priority: 'high',
        status: 'pending',
        isTaskStarted: false,
        date: new Date(),
        type: 'Audit',
        incentive: '₹250',
        incentiveVal: 250,
        employee: employeeId,
        tenant: tenantId,
        coords: { x: 12.9716, y: 77.5946 },
        evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
        checklist: [
          { text: 'Verify store check-in', completed: false },
          { text: 'Upload 4 photos', completed: false }
        ]
      },
      {
        title: 'Merchandise Display',
        store: 'Reliance Fresh',
        companyName: 'Reliance Retail Ltd',
        companyContact: 'Anjali Sharma',
        companyEmail: 'store.support@reliance.com',
        companyInsight: 'Top Tier Client',
        address: 'Indiranagar, Bengaluru',
        distance: '3.4 km',
        distanceVal: 3.4,
        eta: '25 mins',
        priority: 'medium',
        status: 'pending',
        isTaskStarted: false,
        date: new Date(),
        type: 'Retail',
        incentive: '₹150',
        incentiveVal: 150,
        employee: employeeId,
        tenant: tenantId,
        coords: { x: 12.9784, y: 77.6408 }
      }
    ];

    await Task.insertMany(tasks);
    console.log('Sample tasks created for employee');

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedData();
