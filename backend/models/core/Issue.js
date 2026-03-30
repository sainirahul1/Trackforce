const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fromName: {
    type: String,
    required: true,
  },
  fromRole: {
    type: String,
    enum: ['employee', 'manager', 'tenant', 'superadmin'],
    required: true,
  },
  to: {
    type: String,
    enum: ['manager', 'tenant', 'superadmin'],
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'core.issues' });

module.exports = mongoose.model('Issue', issueSchema);
