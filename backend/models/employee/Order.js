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
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
    default: 'pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, collection: 'employee.orders' });

module.exports = mongoose.model('Order', orderSchema);
