require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function testPut() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  // Find a superadmin user
  const user = await db.collection('tenant.users').findOne({ role: 'superadmin' });
  if (!user) {
    console.log("No superadmin found.");
    process.exit(0);
  }

  // Generate token
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });

  // Make request
  try {
    const res = await fetch('http://localhost:5001/api/superadmin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        maintenanceMode: true,
        platformName: "TrackForce"
      })
    });
    
    const data = await res.json();
    if (!res.ok) {
      console.log("Request failed:", res.status, data);
    } else {
      console.log("Request succeeded:", data);
    }
  } catch (error) {
    console.log("Network error:", error.message);
  }
  process.exit(0);
}

testPut();
