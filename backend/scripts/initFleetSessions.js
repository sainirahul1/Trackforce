const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/tenant/User');
const TrackingSession = require('../models/employee/TrackingSession');

async function initFleetSessions() {
  try {
    console.log('--- STARTING FLEET SYNCHRONIZATION ---');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find UV and Naresh in the User collection
    const agents = await User.find({ 
      name: { $regex: /UV|Naresh/i },
      role: 'employee'
    });

    if (agents.length === 0) {
      console.log('No agents found. Make sure UV and Naresh exist in Users.');
      process.exit(0);
    }

    // Clear existing active sessions for these specific users to avoid duplicates
    await TrackingSession.deleteMany({ 
      user: { $in: agents.map(a => a._id) },
      status: 'active' 
    });

    for (const agent of agents) {
      console.log(`Activating Real-Time Backend Session for: ${agent.name}`);
      
      await TrackingSession.create({
        user: agent._id,
        tenant: agent.tenant,
        startTime: new Date(),
        status: 'active',
        employeeName: agent.name,
        manager: agent.manager || null,
        managerName: 'Fleet Command',
        currentAddress: 'Hitech City Corridor',
        currentCity: 'Hyderabad',
        route: [
          { lat: 17.4450, lng: 78.3750, timestamp: new Date() },
          { lat: 17.4460, lng: 78.3760, timestamp: new Date() }
        ]
      });
    }

    console.log('--- BACKEND SYNC COMPLETE ---');
    process.exit(0);
  } catch (err) {
    console.error('SYNC ERROR:', err);
    process.exit(1);
  }
}

initFleetSessions();
