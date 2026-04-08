const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

async function injectData() {
  try {
    console.log('--- STARTING DEFINITIVE DATA INJECTION ---');
    await client.connect();
    console.log('Connected to MongoDB.');
    const db = client.db();
    
    // Collections
    const sessionsCol = db.collection('manager.tracking_sessions');
    const usersCol = db.collection('tenant.users');

    const names = ['Employee4', 'Employee5'];
    
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
      console.log(`Injecting for ${name}...`);
      
      const user = await usersCol.findOne({ 
        name: { $regex: new RegExp(name, 'i') } 
      });

      if (!user) {
        console.log(`❌ User ${name} not found in tenant.users!`);
        continue;
      }

      console.log(`Found User: ${user.name} (${user._id})`);

      // 1. Force User Status
      await usersCol.updateOne(
        { _id: user._id },
        { $set: { isTracking: true, status: 'Active' } }
      );

      // 2. Force Active Session
      const sessionData = {
        user: user._id,
        tenant: user.tenant,
        manager: user.manager,
        employeeName: user.name,
        startTime: new Date(),
        status: 'active',
        currentAddress: mockData[name].address,
        currentCity: 'Hyderabad',
        destination: mockData[name].dest,
        route: [{
          lat: mockData[name].lat,
          lng: mockData[name].lng,
          timestamp: new Date()
        }],
        updatedAt: new Date()
      };

      // Upsert: Try to update existing active session, or create new
      const result = await sessionsCol.updateOne(
        { user: user._id, status: 'active' },
        { $set: sessionData },
        { upsert: true }
      );

      console.log(`✅ Session for ${name} ${result.upsertedCount > 0 ? 'created' : 'updated'}.`);
      console.log(`   Destination set: ${JSON.stringify(mockData[name].dest)}`);
    }

    // FINAL CHECK: List everything in the collection
    const finalCount = await sessionsCol.countDocuments();
    console.log(`Total sessions now: ${finalCount}`);
    
    console.log('\n--- DATA INJECTION COMPLETE ---');
  } catch (err) {
    console.error('INJECTION ERROR:', err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

injectData();
