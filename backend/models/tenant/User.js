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
    lowercase: true,
    trim: true,
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
    type: {
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      employeeId: { type: String, default: '' },
      skills: { type: [String], default: [] },
      team: { type: String, default: '' },
      zone: { type: String, default: '' },
      designation: { type: String, default: '' },
      dob: { type: String, default: '' },
      gender: { type: String, default: '' },
      nationality: { type: String, default: '' },
      bloodGroup: { type: String, default: '' },
      emergencyContact: { type: String, default: '' },
      allergies: { type: String, default: '' },
      department: { type: String, default: '' },
      profileImage: { type: String, default: '' },
      location: { type: String, default: '' },
      employeeCode: { type: String, default: '' },
      dateOfJoin: { type: String, default: '' },
      workArea: { type: String, default: '' },
      reportingTo: { type: String, default: '' },
      securityLevel: { type: String, default: '' },
      verifiedDocuments: {
        type: [{
          name: String,
          url: String,
          verifiedAt: Date
        }],
        default: []
      }
    },
    default: () => ({})
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
  subscription: {
    plan: {
      type: String,
      default: 'Free',
    },
    status: {
      type: String,
      enum: ['active', 'trial', 'expired', 'inactive'],
      default: 'trial',
    },
    price: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    nextBillingDate: {
      type: Date,
    },
    trialEndsAt: {
      type: Date,
    },
    employeeLimit: {
      type: Number,
      default: 5,
    },
    features: {
      type: [String],
      default: [],
    },
    paymentMethod: {
      type: {
        type: String,
        default: 'card',
      },
      last4: {
        type: String,
        default: '',
      },
      brand: {
        type: String,
        default: 'VISA',
      },
    },
    billingHistory: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          enum: ['paid', 'failed', 'pending'],
          default: 'pending',
        },
      },
    ],
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

// Performance Indexes
userSchema.index({ role: 1 }); // fast global role scans (e.g. aggregation pipeline)
userSchema.index({ tenant: 1, role: 1, status: 1 });
userSchema.index({ tenant: 1, createdAt: -1 }); // fast per-tenant user listings
userSchema.index({ manager: 1, tenant: 1 });
userSchema.index({ name: 1, tenant: 1 });
userSchema.index({ 'profile.zone': 1, tenant: 1 });

module.exports = mongoose.model('User', userSchema);
