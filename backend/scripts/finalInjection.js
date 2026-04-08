const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

async function finalInjection() {
  try {
    console.log('--- STARTING ABSOLUTE GUARANTEED INJECTION ---');
    await client.connect();
    console.log('Connected to MongoDB.');
    const db = client.db();
    
    const sessionsCol = db.collection('manager.tracking_sessions');
    const usersCol = db.collection('tenant.users');

    const mockData = {
      Employee4: {
        id: new ObjectId("69d5f30e7a041908773c9e20"),
        lat: 17.4474,
        lng: 78.3762,
        address: '67/2, Patrika Nagar, HITEC City, Hyderabad, Telangana 500081, India',
        dest: { lat: 17.45325270046814, lng: 78.41100914012793 }
      },
      Employee5: {
        id: new ObjectId("69d5f30e7a041908773c9e29"),
        lat: 17.4415,
        lng: 78.3826,
        address: 'Plot No. 1, HITEC City Main Rd, Gachibowli, Hyderabad, Telangana 500032, India',
        dest: { lat: 17.470806353079748, lng: 78.35419371307907 }
      }
    };

    const results = [];

    for (const [name, data] of Object.entries(mockData)) {
      console.log(`Injecting FRESH document for ${name}...`);
      
      const sessionData = {
        user: data.id,
        tenant: new ObjectId("69d5f30e7a041908773c9e1e"),
        employeeName: name,
        startTime: new Date(),
        status: 'active',
        currentAddress: data.address,
        currentCity: 'Hyderabad',
        destination: data.dest,
        sync_tag: 'DEFINITIVE_SYNC_2026',
        route: [{
          lat: data.lat,
          lng: data.lng,
          timestamp: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await sessionsCol.insertOne(sessionData);
      results.push({ name, id: result.insertedId });
      console.log(`✅ ${name} inserted with ID: ${result.insertedId}`);
    }

    console.log('\n--- VERIFICATION IDs FOR ATLAS ---');
    results.forEach(r => {
      console.log(`${r.name}: ObjectId("${r.id}")`);
    });

    const finalCount = await sessionsCol.countDocuments();
    console.log(`\nTotal sessions now: ${finalCount}`);
    
    console.log('\n--- DATA INJECTION COMPLETE ---');
  } catch (err) {
    console.error('INJECTION ERROR:', err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

finalInjection();
