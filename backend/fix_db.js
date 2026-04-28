require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/tenant/User');
  const Tenant = require('./models/superadmin/Tenant');
  const Team = require('./models/manager/Team');
  const StoreVisit = require('./models/employee/StoreVisit');

  const tfTenant = await Tenant.findOne({ name: 'TrackForce' });
  console.log('TrackForce tenant:', tfTenant._id);

  // Update Users
  const userRes = await User.updateMany({}, { $set: { tenant: tfTenant._id } });
  console.log('Updated users:', userRes.modifiedCount);

  // Update Teams
  const teamRes = await Team.updateMany({}, { $set: { tenant: tfTenant._id } });
  console.log('Updated teams:', teamRes.modifiedCount);

  // Update StoreVisits
  const visitRes = await StoreVisit.updateMany({}, { $set: { tenant: tfTenant._id } });
  console.log('Updated visits:', visitRes.modifiedCount);

  process.exit(0);
}).catch(e => console.log(e));
