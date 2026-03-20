require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const settings = await db.collection('superadmin.settings').find({}).toArray();
  console.log("Settings docs:", settings);
  process.exit(0);
}
check();
