const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  type: {
    type: String,
    enum: ['login', 'logout', 'start_tracking', 'stop_tracking', 'visit_start', 'visit_end', 'order_placed'],
    required: true,
  },
  details: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'employee.activity_logs' });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
