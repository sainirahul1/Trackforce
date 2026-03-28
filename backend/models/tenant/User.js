const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'tenant', 'manager', 'employee'],
    default: 'employee',
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  profile: {
    phone: String,
    address: String,
    employeeId: String,
    skills: [String],
    team: String,
    zone: String,
    designation: String,
    dob: String,
    gender: String,
    nationality: String,
    bloodGroup: String,
    emergencyContact: String,
    allergies: String,
    department: String,
    profileImage: String,
    location: String,
    employeeCode: String,
    dateOfJoin: String,
    workArea: String,
    reportingTo: String,
    securityLevel: String,
  },
  isDeactivated: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Duty', 'Off Duty', 'On Leave'],
    default: 'Active',
  },
  isTracking: {
    type: Boolean,
    default: false,
  },
  lastLogoutAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'tenant.users' });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
