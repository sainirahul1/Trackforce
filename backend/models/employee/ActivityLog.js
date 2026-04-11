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
    enum: [
      'login', 'logout',
      'start_tracking', 'stop_tracking', 
      'shift_start', 'shift_end',
      'visit_start', 'visit_end', 'visit_missed', 'visit_delayed',
      'order_placed', 'order_updated', 'order_delivered',
      'alert', 'route_deviation', 
      'task_assigned', 'task_started', 'task_completed', 'task_delayed', 'task_followup', 'task_rejected'
    ],
    required: true,
  },
  title: String, // Optional human-readable title
  status: {
    type: String,
    enum: ['success', 'warning', 'info', 'default', 'urgent'],
    default: 'default'
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

// Indexes for performance
activityLogSchema.index({ tenant: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ type: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
