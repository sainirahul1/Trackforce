const mongoose = require('mongoose');

const storeVisitSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'partially_completed', 'not_interested', 'follow_up'],
    required: true,
  },
  address: String,
  distance: String,
  eta: String,
  gps: {
    lat: Number,
    lng: Number,
  },
  photos: [String], // URLs to cloud storage
  notes: String,
  visitForm: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'employee.store_visits' });

module.exports = mongoose.model('StoreVisit', storeVisitSchema);
