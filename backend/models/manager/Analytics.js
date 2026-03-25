const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  metrics: {
    totalRevenue: Number,
    activeTasks: Number,
    successRate: Number,
    totalEmployees: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true, collection: 'manager.analytics' });

module.exports = mongoose.model('ManagerAnalytics', analyticsSchema);
