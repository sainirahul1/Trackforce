const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', process.env.MONGO_URI ? 'Present' : 'Missing');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully to MongoDB');

    const db = mongoose.connection.db;
    const stats = await db.command({ dbStats: 1 });
    console.log('📊 Database Stats:');
    console.log(` - Database: ${stats.db}`);
    console.log(` - Collections: ${stats.collections}`);
    console.log(` - Objects: ${stats.objects}`);
    console.log(` - Avg Object Size: ${stats.avgObjSize} bytes`);
    console.log(` - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(` - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);

    const collections = await db.listCollections().toArray();
    console.log('\n📁 Collections Found:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(` - ${col.name}: ${count} documents`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
