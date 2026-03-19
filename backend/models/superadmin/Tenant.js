const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    unique: true,
    sparse: true,
  },
  onboardingStatus: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'active',
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic',
    },
    status: {
      type: String,
      enum: ['active', 'past_due', 'canceled'],
      default: 'active',
    },
    expiry: Date,
    employeeLimit: Number,
  },
  settings: {
    logo: String,
    primaryColor: String,
    trackingInterval: {
      type: Number,
      default: 15, // seconds
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'superadmin.tenants' });

module.exports = mongoose.model('Tenant', tenantSchema);
