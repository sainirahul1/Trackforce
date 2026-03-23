const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  items: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
  },
  deliveryDate: {
    type: String, // String or Date works, frontend sends YYYY-MM-DD
  },
  notes: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'canceled'],
    default: 'pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'employee.orders' });

module.exports = mongoose.model('Order', orderSchema);
