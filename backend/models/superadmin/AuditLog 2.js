const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['PERMISSIONS UPDATED', 'CONFIG UPDATE', 'PLATFORM INITIALIZATION', 'SECURITY ALERT']
  },
  action: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'Success'
  }
}, { timestamps: true, collection: 'superadmin.auditlogs' });

module.exports = mongoose.model('AuditLog', auditLogSchema);
