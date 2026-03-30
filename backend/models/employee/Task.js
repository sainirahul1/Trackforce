const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  companyName: String,
  companyContact: String,
  companyEmail: String,
  companyInsight: String,
  companyDescription: String,
  address: String,
  distance: String,
  distanceVal: Number,
  eta: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'delayed', 'completed', 'cancelled'],
    default: 'pending',
  },
  visitStatus: String,
  missionStatus: String,
  isTaskStarted: {
    type: Boolean,
    default: false,
  },
  dueDate: String,
  date: {
    type: Date,
    default: Date.now,
  },
  type: String,
  incentive: String,
  incentiveVal: Number,
  difficulty: String,
  coords: {
    x: Number,
    y: Number,
  },
  evidence: {
    storeFront: String,
    selfie: String,
    productDisplay: String,
    officialDoc: String,
  },
  checklist: [{
    id: Number,
    text: String,
    completed: {
      type: Boolean,
      default: false,
    },
  }],
  visitNotes: String,
}, { timestamps: true, collection: 'employee.tasks' });

taskSchema.index({ tenant: 1, date: -1 });
taskSchema.index({ tenant: 1, status: 1 });
taskSchema.index({ employee: 1, createdAt: -1 });
taskSchema.index({ employee: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
