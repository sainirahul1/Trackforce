const mongoose = require('mongoose');

const managerActivitySchema = new mongoose.Schema({
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
      'task_assigned', 'task_reassigned', 'task_deleted',
      'visit_reviewed', 'visit_approved', 'visit_rejected',
      'team_member_added',
      'inventory_updated', 'profile_updated'
    ],
    required: true,
  },
  title: String,
  status: {
    type: String,
    enum: ['success', 'warning', 'info', 'default', 'urgent'],
    default: 'default'
  },
  details: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'manager.activity_logs' });

managerActivitySchema.index({ tenant: 1, createdAt: -1 });
managerActivitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ManagerActivity', managerActivitySchema);
