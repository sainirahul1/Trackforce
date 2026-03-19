const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
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
  coords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  speed: Number,
  heading: Number,
  altitude: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'employee.locations' });

module.exports = mongoose.model('Location', locationSchema);
