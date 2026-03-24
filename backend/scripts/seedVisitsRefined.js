const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const StoreVisit = require('../models/employee/StoreVisit');
const User = require('../models/tenant/User');

const STORES = [
  "Partner Store A", "Partner Store B", "Metro Retail Hub", 
  "Sunrise Electronics", "Global Tech HQ", "Alpha Distribution",
  "Nexus Wholesale", "City Center Mall", "Railway Station Outlet", "North Zone Hub"
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected.');

    const employees = await User.find({ role: 'employee' });
    console.log(`Found ${employees.length} employees.`);

    for (const emp of employees) {
      console.log(`Processing: ${emp.name} (${emp.email})`);
      
      // Clear old
      await StoreVisit.deleteMany({ employee: emp._id });
      
      const visits = [];
      const now = new Date();
      const tenantId = emp.tenant || '69c0fbbe60763acca36b8dbe'; // Fallback to ReatchAll tenant if missing

      for (let i = 0; i < 25; i++) {
        const ts = new Date(now);
        ts.setDate(now.getDate() - Math.floor(Math.random() * 30));
        ts.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));

        const status = Math.random() > 0.4 ? 'completed' : 'pending';
        const onTime = Math.random() > 0.3 ? 'completed' : 'delay';
        const isConsistent = Math.random() > 0.2 ? 'consistent' : 'inconsistent';

        visits.push({
          employee: emp._id,
          tenant: tenantId,
          storeName: STORES[i % STORES.length],
          status,
          onTime,
          isConsistent,
          address: `Main St, City`,
          gps: { lat: 12.9, lng: 77.5 },
          notes: "Visit notes data for validation.",
          timestamp: ts,
          createdAt: ts,
          updatedAt: ts
        });
      }

      try {
        await StoreVisit.insertMany(visits, { ordered: false });
        console.log(`  -> Seeded 25 visits.`);
      } catch (e) {
        console.log(`  -> Error seeding for ${emp.email}: ${e.message}`);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
}

seed();
