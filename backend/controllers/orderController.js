const Order = require('../models/employee/Order');

// @desc    Get all orders for the tenant
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ tenant: req.tenantId })
      .populate('employee', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const { storeName, items, totalAmount, status, paymentMethod, deliveryDate, notes } = req.body;

  try {
    const order = await Order.create({
      employee: req.user._id,
      tenant: req.tenantId,
      storeName,
      items,
      totalAmount,
      paymentMethod,
      deliveryDate,
      notes,
      status: status || 'pending',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an order
// @route   PUT /api/orders/:id
// @access  Private
exports.updateOrder = async (req, res) => {
  const { storeName, items, totalAmount, status, paymentMethod, deliveryDate, notes } = req.body;

  try {
    let order = await Order.findOne({ _id: req.params.id, tenant: req.tenantId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update fields if provided
    if (storeName) order.storeName = storeName;
    if (items) order.items = items;
    if (totalAmount) order.totalAmount = totalAmount;
    if (status) order.status = status;
    if (paymentMethod !== undefined) order.paymentMethod = paymentMethod;
    if (deliveryDate !== undefined) order.deliveryDate = deliveryDate;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
