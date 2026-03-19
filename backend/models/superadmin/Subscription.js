const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: String,
    required: true
  },
  interval: {
    type: String,
    enum: ['month', 'year'],
    default: 'month'
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  employeeLimit: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String, // lucide icon name
    default: 'Zap'
  },
  color: {
    type: String,
    default: 'blue'
  }
}, { timestamps: true, collection: 'superadmin.subscriptions' });

module.exports = mongoose.model('Subscription', subscriptionSchema);
