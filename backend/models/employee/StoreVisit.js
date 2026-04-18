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
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null,
  },
  storeName: {
    type: String,
    required: true,
  },
  ownerName: String,
  mobileNumber: String,
  visitType: {
    type: String,
    enum: ['store', 'supplier', 'collab', 'app', 'mission'],
    default: 'store',
  },
  status: {
    type: String,
    default: 'completed'
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
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: String,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  distance: String,
  eta: String,
  gps: {
    lat: Number,
    lng: Number,
  },
  classification: String,
  milestones: {
    initialCheck: { type: Boolean, default: false },
    knowledgeShared: { type: Boolean, default: false },
    orderLogged: { type: Boolean, default: false },
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
storeVisitSchema.index({ employee: 1, createdAt: -1 });

module.exports = mongoose.model('StoreVisit', storeVisitSchema);
