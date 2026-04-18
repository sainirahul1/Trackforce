const mongoose = require('mongoose');

const employeeLogVisitSchema = new mongoose.Schema({
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
  // 01. Identity
  storeName: { type: String, required: true },
  ownerName: String,
  mobileNumber: String,
  
  // 02. Geography
  address: String,
  city: String,
  state: String,
  pinCode: String,
  gps: {
    lat: Number,
    lng: Number,
  },
  
  // 03. Operations
  classification: String,
  
  // 04. Milestones
  milestones: {
    initialCheck: { type: Boolean, default: false },
    knowledgeShared: { type: Boolean, default: false },
    orderLogged: { type: Boolean, default: false },
  },
  
  // 05. Outcome
  status: {
    type: String,
    default: 'completed'
  },
  photos: [String],
  notes: String,
  
  // Metadata
  visitType: {
    type: String,
    enum: ['mission', 'store', 'supplier', 'collab', 'app', 'LogVisit'],
    default: 'mission',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'employeelogvisits' });

employeeLogVisitSchema.index({ tenant: 1, timestamp: -1 });
employeeLogVisitSchema.index({ employee: 1, createdAt: -1 });

module.exports = mongoose.model('EmployeeLogVisit', employeeLogVisitSchema);
