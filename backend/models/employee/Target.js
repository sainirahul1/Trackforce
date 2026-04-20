const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
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
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  monthlyTarget: {
    type: Number,
    required: true,
    min: 0,
    alias: 'dailyTarget' // For internal transition
  },
  date: {
    type: Date,
    required: true
  },
  note: String,
}, { 
  timestamps: true, 
  collection: 'employee.targets' 
});

// Compound index to ensure uniqueness per day per employee
targetSchema.index({ employee: 1, date: 1 }, { unique: true });
targetSchema.index({ tenant: 1, manager: 1 });

module.exports = mongoose.model('Target', targetSchema);
