const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/tenant/User');
const TrackingSession = require('../models/employee/TrackingSession');

async function seedFleet() {
  try {
    console.log('--- STARTING DATA-DRIVEN FLEET SEEDING ---');
    console.log('Connecting to Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.\n');

    const names = ['Employee4', 'Employee5'];
    
    // User requested specific destinations
    const mockData = {
      Employee4: {
        lat: 17.4474,
        lng: 78.3762,
        address: '67/2, Patrika Nagar, HITEC City, Hyderabad, Telangana 500081, India',
        dest: { lat: 17.45325270046814, lng: 78.41100914012793 }
      },
      Employee5: {
        lat: 17.4415,
        lng: 78.3826,
        address: 'Plot No. 1, HITEC City Main Rd, Gachibowli, Hyderabad, Telangana 500032, India',
        dest: { lat: 17.470806353079748, lng: 78.35419371307907 }
      }
    };

    for (const name of names) {
      console.log(`Processing ${name}...`);
      
      const user = await User.findOne({ 
        name: new RegExp(name, 'i') 
      });

      if (!user) {
        console.log(`❌ User ${name} not found! Skipping.`);
        continue;
      }

      console.log(`Found user: ${user.name} (${user._id})`);

      // Update User tracking status
      await User.findByIdAndUpdate(user._id, { isTracking: true, status: 'Active' });

      // Check for existing active session
      let session = await TrackingSession.findOne({ user: user._id, status: 'active' });

      const data = mockData[name];

      if (!session) {
        console.log(`Creating new session for ${name}...`);
        session = await TrackingSession.create({
          user: user._id,
          tenant: user.tenant,
          manager: user.manager,
          employeeName: user.name,
          startTime: new Date(),
          status: 'active',
          currentAddress: data.address,
          currentCity: 'Hyderabad',
          destination: data.dest,
          route: [{
            lat: data.lat,
            lng: data.lng,
            timestamp: new Date()
          }]
        });
      } else {
        console.log(`Updating existing session for ${name}...`);
        session.currentAddress = data.address;
        session.destination = data.dest;
        session.route = [{ lat: data.lat, lng: data.lng, timestamp: new Date() }];
        await session.save();
      }

      console.log(`✅ ${name} localized with Destination: ${data.dest.lat}, ${data.dest.lng}`);
    }

    console.log('\n--- DATA-DRIVEN SEEDING COMPLETE ---');
    process.exit(0);
  } catch (err) {
    console.error('CRITICAL SEEDING ERROR:', err);
    process.exit(1);
  }
}

seedFleet();
