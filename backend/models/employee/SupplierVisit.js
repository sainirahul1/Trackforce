const mongoose = require('mongoose');

const supplierVisitSchema = new mongoose.Schema({
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
  supplierDetails: {
    name: { type: String, required: true },
    address: String,
    contact: String,
  },
  outcome: String,
  followUpDate: Date,
  gps: {
    lat: Number,
    lng: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'employee.supplier_visits' });

module.exports = mongoose.model('SupplierVisit', supplierVisitSchema);
