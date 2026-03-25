const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
    unique: true
  },
  tenant: {
    type: Boolean,
    default: false
  },
  manager: {
    type: Boolean,
    default: false
  },
  employee: {
    type: Boolean,
    default: false
  },
  superAdmin: {
    type: Boolean,
    default: true // Super admin always has access
  }
}, { timestamps: true, collection: 'superadmin.permissions' });

module.exports = mongoose.model('Permission', permissionSchema);
