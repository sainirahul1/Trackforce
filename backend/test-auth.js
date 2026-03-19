const fetch = require('node-fetch');

const API_URL = 'http://localhost:5001/api/auth';

const testAuth = async () => {
  console.log('--- Testing TrackForce Auth API ---');

  try {
    // 1. Register a test user
    console.log('\n1. Registering test user...');
    const regRes = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Admin',
        company: 'Test Corp',
        email: 'testadmin@example.com',
        password: 'password123',
        role: 'superadmin'
      })
    });
    const regData = await regRes.json();
    console.log('Register Response:', regData);

    // 2. Login with the same user
    console.log('\n2. Logging in...');
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testadmin@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);

    if (loginData.token) {
      console.log('\n✅ Auth Test Passed!');
    } else {
      console.log('\n❌ Auth Test Failed: No token returned');
    }

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.log('Note: Ensure the backend server is running on port 5001 and MongoDB is active.');
  }
};

testAuth();
