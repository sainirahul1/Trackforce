const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema({
  platformName: {
    type: String,
    default: 'TrackForce SaaS'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  globalNotifications: {
    type: Boolean,
    default: true
  },
  integrations: {
    googleMaps: {
      apiKey: String,
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
      }
    },
    emailService: {
      provider: String,
      apiKey: String,
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
      }
    }
  }
}, { timestamps: true, collection: 'superadmin.settings' });

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
