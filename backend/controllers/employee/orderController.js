const Order = require('../../models/employee/Order');
const StoreVisit = require('../../models/employee/StoreVisit');

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

// @desc    Get order statistics for the tenant
// @route   GET /api/orders/stats
// @access  Private
exports.getOrderStats = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month stats
    const currentOrders = await Order.find({
      tenant: tenantId,
      createdAt: { $gte: startOfMonth }
    });

    const previousOrders = await Order.find({
      tenant: tenantId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const totalRevenue = currentOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const prevRevenue = previousOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const revenueChange = prevRevenue === 0 ? 100 : ((totalRevenue - prevRevenue) / prevRevenue) * 100;

    const activeOrdersCount = await Order.countDocuments({
      tenant: tenantId,
      status: { $in: ['pending', 'processing', 'shipped'] }
    });

    const prevActiveOrdersCount = await Order.countDocuments({
      tenant: tenantId,
      status: { $in: ['pending', 'processing', 'shipped'] },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const activeOrdersChange = prevActiveOrdersCount === 0 ? 100 : ((activeOrdersCount - prevActiveOrdersCount) / prevActiveOrdersCount) * 100;

    const totalOrdersCount = await Order.countDocuments({ tenant: tenantId });
    const avgOrderValue = totalOrdersCount === 0 ? 0 : (await Order.aggregate([
      { $match: { tenant: tenantId } },
      { $group: { _id: null, avg: { $avg: "$totalAmount" } } }
    ]))[0]?.avg || 0;

    const prevAvgOrderValue = await Order.aggregate([
      { $match: { tenant: tenantId, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, avg: { $avg: "$totalAmount" } } }
    ]);
    const prevAvg = prevAvgOrderValue[0]?.avg || 0;
    const avgValueChange = prevAvg === 0 ? 0 : ((avgOrderValue - prevAvg) / prevAvg) * 100;

    // Conversion Rate: (Orders / Visits)
    const totalVisits = await StoreVisit.countDocuments({ tenant: tenantId });
    const conversionRate = totalVisits === 0 ? 0 : (totalOrdersCount / totalVisits) * 100;

    const prevVisits = await StoreVisit.countDocuments({
      tenant: tenantId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const prevOrdersCount = previousOrders.length;
    const prevConversionRate = prevVisits === 0 ? 0 : (prevOrdersCount / prevVisits) * 100;
    const conversionRateChange = conversionRate - prevConversionRate;

    res.json({
      totalRevenue: {
        value: totalRevenue,
        change: revenueChange.toFixed(1) + '%'
      },
      activeOrders: {
        value: activeOrdersCount,
        change: activeOrdersChange.toFixed(1) + '%'
      },
      conversionRate: {
        value: conversionRate.toFixed(2) + '%',
        change: (conversionRateChange >= 0 ? '+' : '') + conversionRateChange.toFixed(1) + '%'
      },
      avgOrderValue: {
        value: avgOrderValue.toFixed(2),
        change: (avgValueChange >= 0 ? '+' : '') + avgValueChange.toFixed(1) + '%'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
