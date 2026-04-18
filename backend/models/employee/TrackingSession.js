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
    accuracy: Number,        // GPS accuracy in meters
    battery: Number,         // Battery percentage (0-100)
    speed: Number,           // Speed in m/s from device
    heading: Number,         // Compass heading in degrees
    deviceId: String,        // Device user-agent fingerprint
  }],
  // Activity Intelligence (computed server-side on each update)
  activitySummary: {
    totalMovingTime: { type: Number, default: 0 },    // seconds
    totalIdleTime: { type: Number, default: 0 },      // seconds
    totalVisitTime: { type: Number, default: 0 },     // seconds
    totalTravelTime: { type: Number, default: 0 },    // seconds
    avgSpeed: { type: Number, default: 0 },           // km/h
    maxSpeed: { type: Number, default: 0 },           // km/h
    lastBattery: { type: Number, default: -1 },
    lastAccuracy: { type: Number, default: -1 },
    activityState: { type: String, enum: ['moving', 'idle', 'visiting'], default: 'idle' },
    lastStateChange: { type: Date, default: Date.now },
  },
  autoClosed: {
    type: Boolean,
    default: false
  },
  notTurnedOffLocation: { // Specific field requested for audit trail
    type: Boolean,
    default: false
  },
  autoClosedAt: Date,
  closureReason: {
    type: String,
    default: ''
  }
}, { timestamps: true, collection: 'manager.tracking_sessions' });

module.exports = mongoose.model('TrackingSession', trackingSessionSchema);
