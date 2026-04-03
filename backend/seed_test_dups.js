require('dotenv').config({path: 'c:/Users/Dell/ReatchAll/ReatchallFrntEnd/trackforce_frontend/backend/.env'});
const mongoose = require('mongoose');
const User = require('c:/Users/Dell/ReatchAll/ReatchallFrntEnd/trackforce_frontend/backend/models/tenant/User.js');

async function seedTestDups() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    // Create 3 users with the same phone number
    const testPhone = '999-000-1111';
    const testUsers = [
      {
        name: '[TEST DUMMY] Candidate 1',
        company: 'ReatchAll',
        email: 'test_dummy_1@example.com',
        password: 'password123',
        role: 'employee',
        profile: { phone: testPhone }
      },
      {
        name: '[TEST DUMMY] Candidate 2',
        company: 'ReatchAll',
        email: 'test_dummy_2@example.com',
        password: 'password123',
        role: 'employee',
        profile: { phone: testPhone }
      },
      {
        name: '[TEST DUMMY] Candidate 3',
        company: 'ReatchAll',
        email: 'test_dummy_3@example.com',
        password: 'password123',
        role: 'employee',
        profile: { phone: testPhone }
      }
    ];

    console.log('Seeding 3 duplicate test records...');
    await User.insertMany(testUsers);
    
    console.log('DONE: Seeding successful.');
    console.log(`Scan 'By Phone Number' in the Superadmin Settings to see the results.`);
    console.log(`Matching value: ${testPhone}`);

  } catch (err) {
    console.error('Seeding Error:', err);
  } finally {
    process.exit(0);
  }
}

seedTestDups();
