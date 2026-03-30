const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for global/tenant-wide broadcasts
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: false, // Optional for superadmin global alerts
  },
  role: {
    type: String,
    enum: ['superadmin', 'tenant', 'manager', 'employee', 'all'],
    default: 'all',
  },
  isGlobal: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['task', 'reminder', 'message', 'alert', 'success', 'account', 'system', 'broadcasting'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
}, { timestamps: true, collection: 'tenant.notifications' });

module.exports = mongoose.model('Notification', notificationSchema);
