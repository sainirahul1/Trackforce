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
    enum: ['completed', 'pending', 'incomplete', 'rejected'],
    required: true,
  },
  onTime: {
    type: String,
    enum: ['delay', 'completed'],
    default: 'completed'
  },
  isConsistent: {
    type: String,
    enum: ['consistent', 'inconsistent'],
    default: 'consistent'
  },
  address: String,
  distance: String,
  eta: String,
  gps: {
    lat: Number,
    lng: Number,
  },
  photos: [String], // URLs or Data URLs
  notes: String,
  taskTitle: String,
  taskType: String,
  checklist: [{
    id: Number,
    text: String,
    completed: Boolean
  }],
  visitForm: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'employee.store_visits' });

storeVisitSchema.index({ tenant: 1, timestamp: -1 });

module.exports = mongoose.model('StoreVisit', storeVisitSchema);
