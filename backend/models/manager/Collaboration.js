const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema({
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
  organizationDetails: {
    name: { type: String, required: true },
    contact: String,
  },
  opportunityValue: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['Partnership', 'Referral', 'Joint Venture', 'Other'],
    default: 'Other',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'manager.collaborations' });

module.exports = mongoose.model('Collaboration', collaborationSchema);
