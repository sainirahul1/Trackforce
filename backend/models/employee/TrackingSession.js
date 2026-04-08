const mongoose = require('mongoose');

const trackingSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: Date,
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
  distanceTravelled: {
    type: Number,
    default: 0,
  },
  employeeName: String,
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  managerName: String,
  currentAddress: String,
  currentCity: String,
  destination: {
    lat: Number,
    lng: Number,
    address: String
  },
  route: [{
    lat: Number,
    lng: Number,
    timestamp: Date,
  }],
}, { timestamps: true, collection: 'manager.tracking_sessions' });

module.exports = mongoose.model('TrackingSession', trackingSessionSchema);
