const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    unique: true,
  },
  general: {
    companyName: {
      type: String,
      default: 'TrackForce Logistics',
    },
    officialEmail: {
      type: String,
      default: 'admin@trackforce.io',
    },
    hqAddress: {
      type: String,
      default: '123 Innovation Drive, Tech City, NY 10001',
    },
    logoUrl: {
      type: String,
      default: null,
    },
  },
  localization: {
    timezone: {
      type: String,
      default: 'EST',
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  account: {
    status: {
      type: String,
      default: 'Active',
    },
    featureFlags: {
      type: [String],
      default: [],
    },
  },
  security: {
    lastPasswordChange: {
      type: Date,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    globalSignOutAt: {
      type: Date,
    },
  },
}, { timestamps: true, collection: 'tenant.settings' });

module.exports = mongoose.model('TenantSettings', settingsSchema);
