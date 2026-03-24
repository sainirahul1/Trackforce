const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  capabilities: {
    type: [Number],
    default: [85, 90, 75, 95, 80]
  }
}, { timestamps: true, collection: 'employee.dashboard' });

module.exports = mongoose.model('Dashboard', dashboardSchema);
