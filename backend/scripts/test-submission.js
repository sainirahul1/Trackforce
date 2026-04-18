const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const EmployeeLogVisit = require('../models/employee/EmployeeLogVisit');
const User = require('../models/tenant/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testSubmission = async () => {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find a valid employee and tenant
    const user = await User.findOne({ role: 'employee' });
    if (!user) {
      console.error('No employee found to use for test');
      process.exit(1);
    }
    
    console.log(`Using User: ${user.name} (${user._id}) for test.`);
    
    const visit = await EmployeeLogVisit.create({
      employee: user._id,
      tenant: user.tenant,
      storeName: 'Test Victory Store',
      ownerName: 'Test Owner',
      mobileNumber: '9999999999',
      status: 'interest_shown', // This would have failed before
      visitType: 'mission',
      milestones: {
        initialCheck: true,
        knowledgeShared: true,
        orderLogged: false
      },
      timestamp: new Date()
    });
    
    console.log('SUCCESS: Test Log Entry Created!');
    console.log('ID:', visit._id);
    
    process.exit(0);
  } catch (err) {
    console.error('SUBMISSION FAILED:', err);
    process.exit(1);
  }
};

testSubmission();
