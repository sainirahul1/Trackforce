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
    enum: ['pending', 'completed', 'partially_completed', 'not_interested', 'follow_up', 'incomplete', 'rejected'],
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
  reviewStatus: {
    type: String,
    enum: ['Pending Review', 'Approved', 'Rejected'],
    default: 'Pending Review',
  },
  rejectionReason: String,
  address: String,
  distance: String,
  eta: String,
  gps: {
    lat: Number,
    lng: Number,
  },
  photos: [String], // URLs or Data URLs
  notes: String,
  reviewStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: String,
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
storeVisitSchema.index({ employee: 1, createdAt: -1 });

module.exports = mongoose.model('StoreVisit', storeVisitSchema);
