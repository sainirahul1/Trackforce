require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  await db.collection('superadmin.settings').updateOne({}, { $set: { maintenanceMode: true } });
  console.log("Updated to true");
  process.exit(0);
}
check();
