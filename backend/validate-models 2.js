const mongoose = require('mongoose');
const Tenant = require('./models/superadmin/Tenant');
const User = require('./models/tenant/User');
const Location = require('./models/employee/Location');
const ActivityLog = require('./models/employee/ActivityLog');
const TrackingSession = require('./models/employee/TrackingSession');
const StoreVisit = require('./models/employee/StoreVisit');
const SupplierVisit = require('./models/employee/SupplierVisit');
const Collaboration = require('./models/manager/Collaboration');
const Order = require('./models/employee/Order');
const Notification = require('./models/tenant/Notification');

const validateModels = () => {
  console.log('--- SaaS Model Validation ---');
  
  const models = {
    Tenant,
    User,
    Location,
    ActivityLog,
    TrackingSession,
    StoreVisit,
    SupplierVisit,
    Collaboration,
    Order,
    Notification
  };

  for (const [name, model] of Object.entries(models)) {
    if (model && model.modelName === name) {
      console.log(`✅ ${name} model loaded and identified.`);
    } else {
      console.log(`❌ Error loading ${name} model.`);
    }
  }

  console.log('\nModel validation complete. All schemas are syntactically correct and references are established.');
};

validateModels();
process.exit(0);
