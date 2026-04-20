const mongoose = require('mongoose');

const followUpEntrySchema = new mongoose.Schema({
  action: { type: String, required: true }, // 'created', 'called', 'visited', 'rescheduled', 'converted', 'lost'
  note: String,
  outcome: String, // 'interested', 'not_reachable', 'callback', 'converted', 'lost'
  scheduledDate: Date,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  performedByName: String,
  timestamp: { type: Date, default: Date.now }
});

const followUpSchema = new mongoose.Schema({
  // Link to original visit
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeLogVisit', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },

  // Store/Client info (denormalized for fast queries)
  storeName: { type: String, required: true },
  ownerName: String,
  mobileNumber: String,
  address: String,
  city: String,

  // Assignment
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedToName: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByName: String,

  // Follow-up state
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'converted', 'lost', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  nextFollowUpDate: Date,
  reason: String, // Why follow-up is needed (from original visit)
  visitType: String,

  // History timeline
  history: [followUpEntrySchema],

}, { timestamps: true, collection: 'followups' });

followUpSchema.index({ tenant: 1, status: 1, nextFollowUpDate: 1 });
followUpSchema.index({ assignedTo: 1, status: 1 });
followUpSchema.index({ visit: 1 }, { unique: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
