const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    console.log('Available Collections:', collections.map(c => c.name));
    
    if (collections.some(c => c.name === 'employeelogvisits')) {
      const count = await db.collection('employeelogvisits').countDocuments();
      console.log(`Document count in 'employeelogvisits': ${count}`);
      
      if (count > 0) {
        const latest = await db.collection('employeelogvisits').find().sort({ timestamp: -1 }).limit(1).toArray();
        console.log('Latest log entry:', JSON.stringify(latest[0], null, 2));
      }
    } else {
      console.log("Collection 'employeelogvisits' NOT FOUND in database.");
    }
    
    process.exit(0);
  } catch (err) {
    console.error('DB Check Failed:', err);
    process.exit(1);
  }
};

checkDB();
