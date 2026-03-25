const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  designation: { type: String, default: '' },
  team: { type: String, default: '' },
  status: { type: String, enum: ['On Duty', 'Off Duty', 'On Leave'], default: 'Off Duty' },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  address: { type: String, default: '' },
  gender: { type: String, default: '' },
  nationality: { type: String, default: '' },
  dob: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  allergies: { type: String, default: 'None Reported' },
  avatar: { type: String, default: '' },

  // Employment details
  employeeCode: { type: String, default: '' },
  dateOfJoin: { type: Date },
  workArea: { type: String, default: '' },
  reportingTo: { type: String, default: '' },
  securityLevel: { type: String, default: 'Field Access - Level 1' },

  // Settings / Preferences
  settings: {
    language: { type: String, default: 'en' },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    shiftReminders: { type: Boolean, default: true },
    orderAlerts: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false },
    twoFactorAuth: { type: Boolean, default: false },
    loginAlerts: { type: Boolean, default: true },
    sessionTimeout: { type: String, default: '30' }
  }
}, {
  timestamps: true,
  collection: 'employee.profiles'
});

module.exports = mongoose.model('Profile', profileSchema);
