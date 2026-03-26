const mongoose = require('mongoose');

const managerOrderSchema = new mongoose.Schema({
  tenant: { // 1
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  sku: { // 2
    type: String,
    required: true,
    unique: true,
  },
  name: { // 3
    type: String,
    required: true,
  },
  category: { // 4
    type: String,
    required: true,
  },
  stockLevel: { // 5
    type: Number,
    required: true,
    default: 0,
  },
  unit: { // 6
    type: String,
    default: 'pcs',
  },
  price: { // 7
    type: Number,
    required: true,
  },
  supplier: { // 8
    type: String,
    required: true,
  },
  lastRestocked: { // 9
    type: Date,
    default: Date.now,
  },
  status: { // 10
    type: String,
    enum: ['active', 'out-of-stock', 'discontinued'],
    default: 'active',
  },
}, { timestamps: true, collection: 'manager-orders' });

module.exports = mongoose.model('ManagerOrder', managerOrderSchema);
