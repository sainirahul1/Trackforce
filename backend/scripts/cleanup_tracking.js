const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    
    // Names to reset
    const names = ['RA Employee', 'hero'];
    
    console.log('Resetting tracking status for:', names);
    
    // 1. Set isTracking to false for these users
    await db.collection('tenant.users').updateMany(
      { name: { $in: names } },
      { $set: { isTracking: false } }
    );
    
    // 2. Mark all active sessions for these users as completed
    const users = await db.collection('tenant.users').find({ name: { $in: names } }).toArray();
    const userIds = users.map(u => u._id);
    
    await db.collection('manager.tracking_sessions').updateMany(
      { user: { $in: userIds }, status: 'active' },
      { $set: { status: 'completed', endTime: new Date() } }
    );
    
    console.log('Cleanup complete. RA Employee and hero will no longer show up until they manually turn on Duty.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
