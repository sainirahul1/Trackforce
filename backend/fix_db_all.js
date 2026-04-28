require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const collections = await mongoose.connection.db.collections();
  const targetTenantId = new mongoose.Types.ObjectId('69f05d5e60ab522e918741c2');
  const targetTenantStr = '69f05d5e60ab522e918741c2';

  for (let collection of collections) {
    const name = collection.collectionName;
    if (name === 'tenants') continue;

    try {
      // Find documents where tenant exists and is not the target
      // tenant can be ObjectId or string
      const res = await collection.updateMany(
        { tenant: { $exists: true, $ne: targetTenantId } },
        { $set: { tenant: targetTenantId } }
      );
      
      const res2 = await collection.updateMany(
        { tenant: { $exists: true, $type: "string", $ne: targetTenantStr } },
        { $set: { tenant: targetTenantStr } }
      );

      // Also update manager fields if they somehow got messed up? No, the issue is tenant isolation.
      console.log(`Updated ${name}: ${res.modifiedCount + res2.modifiedCount} records migrated to active tenant`);
    } catch (err) {
      console.log(`Error updating ${name}:`, err.message);
    }
  }

  process.exit(0);
}).catch(e => console.log(e));
