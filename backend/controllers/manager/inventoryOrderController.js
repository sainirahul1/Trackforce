const Order = require('../../models/employee/Order');
const ManagerOrder = require('../../models/manager/ManagerOrder');
const User = require('../../models/tenant/User');
const mongoose = require('mongoose');

const getTeamEmployeeIds = async (managerId, tenantId) => {
  const employees = await User.find({ manager: managerId, tenant: tenantId }, '_id');
  return employees.map(emp => emp._id);
};

/**
 * @desc    Get inventory and order dashboard statistics
 * @route   GET /api/manager/inventory-orders/stats
 * @access  Private (Manager)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const tenantId = req.user.tenant;
    const managerId = req.user._id;
    const teamEmployeeIds = await getTeamEmployeeIds(managerId, tenantId);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Current Stats
    const stats = await Order.aggregate([
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(tenantId),
          employee: { $in: teamEmployeeIds },
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          weeklyRevenue: { $sum: '$totalAmount' },
          ordersCollected: { $count: {} },
          avgTicketSize: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Previous Stats for Trend
    const prevStats = await Order.aggregate([
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(tenantId),
          employee: { $in: teamEmployeeIds },
          timestamp: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          weeklyRevenue: { $sum: '$totalAmount' },
          ordersCollected: { $count: {} },
          avgTicketSize: { $avg: '$totalAmount' }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : { weeklyRevenue: 0, ordersCollected: 0, avgTicketSize: 0 };
    const prevResult = prevStats.length > 0 ? prevStats[0] : { weeklyRevenue: 0, ordersCollected: 0, avgTicketSize: 0 };

    // Previous Avg Ticket Size (need to calculate explicitly if not in prevStats aggregation)
    // Actually, I should add it to prevStats aggregation
    const pendingApprovalCount = await Order.countDocuments({
      tenant: tenantId,
      employee: { $in: teamEmployeeIds },
      status: 'pending'
    });

    const calculateTrend = (curr, prev) => {
      if (prev === 0) return '+0%';
      const percent = ((curr - prev) / prev) * 100;
      return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
    };

    res.status(200).json({
      success: true,
      data: {
        weeklyRevenue: result.weeklyRevenue || 0,
        ordersCollected: result.ordersCollected || 0,
        avgTicketSize: Math.round(result.avgTicketSize || 0),
        pendingApproval: pendingApprovalCount,
        revenueTrend: calculateTrend(result.weeklyRevenue || 0, prevResult.weeklyRevenue || 0),
        ordersTrend: calculateTrend(result.ordersCollected || 0, prevResult.ordersCollected || 0),
        ticketTrend: calculateTrend(result.avgTicketSize || 0, prevResult.avgTicketSize || 0),
      }
    });
  } catch (error) {
    console.error('getDashboardStats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get daily revenue data for the last 7 days (Chart)
 * @route   GET /api/manager/inventory-orders/revenue-chart
 * @access  Private (Manager)
 */
exports.getRevenueChartData = async (req, res) => {
  try {
    const tenantId = req.user.tenant;
    const managerId = req.user._id;
    const teamEmployeeIds = await getTeamEmployeeIds(managerId, tenantId);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const chartData = await Order.aggregate([
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(tenantId),
          employee: { $in: teamEmployeeIds },
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Ensure we have 7 days including zeros
    const labels = [];
    const data = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];

      const found = chartData.find(item => item._id === dateStr);
      labels.push(dayName);
      data.push(found ? found.revenue : 0);
    }

    res.status(200).json({
      success: true,
      data: { labels, data }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get recent orders with executive details
 * @route   GET /api/manager/inventory-orders/recent
 * @access  Private (Manager)
 */
exports.getRecentOrders = async (req, res) => {
  try {
    const tenantId = new mongoose.Types.ObjectId(req.user.tenant);
    const managerId = new mongoose.Types.ObjectId(req.user._id);
    const teamEmployeeIds = [managerId, ...(await getTeamEmployeeIds(managerId, tenantId))];
    const { search, page = 1, limit = 5 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { 
      tenant: tenantId, 
      employee: { $in: teamEmployeeIds }
    };

    if (search) {
      const matchingEmployees = await User.find({
        _id: { $in: teamEmployeeIds },
        name: { $regex: search, $options: 'i' }
      }, '_id');
      const matchingEmployeeIds = matchingEmployees.map(e => e._id);

      query.$or = [
        { storeName: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { employee: { $in: matchingEmployeeIds } }
      ];
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('employee', 'name')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    const formattedOrders = orders.map(order => ({
      id: `ORD-${order._id.toString().slice(-4).toUpperCase()}`,
      store: order.storeName,
      executive: order.employee ? order.employee.name : 'Unknown',
      items: order.items,
      amount: '₹' + order.totalAmount.toLocaleString(),
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      date: order.timestamp
    }));

    res.status(200).json({ 
      success: true, 
      data: formattedOrders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limitNum),
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Export Ledger as CSV
 * @route   GET /api/manager/inventory-orders/export
 */
exports.exportLedger = async (req, res) => {
  try {
    const tenantId = req.user.tenant;
    const managerId = req.user._id;
    const teamEmployeeIds = await getTeamEmployeeIds(managerId, tenantId);

    const orders = await Order.find({
      tenant: tenantId,
      employee: { $in: teamEmployeeIds }
    }).populate('employee', 'name');

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for export' });
    }

    // Generate CSV Header
    let csv = 'Order ID,Store Name,Executive,Items,Amount,Status,Date,Payment Method\n';

    // Generate CSV Rows
    orders.forEach(order => {
      csv += `${order._id},"${order.storeName}","${order.employee ? order.employee.name : 'N/A'}",${order.items},${order.totalAmount},${order.status},${order.timestamp.toISOString().split('T')[0]},${order.paymentMethod}\n`;
    });

    // Set Response Headers for Download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ledger_export.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get full inventory list
 * @route   GET /api/manager/inventory-orders/inventory
 * @access  Private (Manager)
 */
exports.getInventory = async (req, res) => {
  try {
    const tenantId = req.user.tenant;
    const inventory = await ManagerOrder.find({ tenant: tenantId });
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new inventory item
 * @route   POST /api/manager/inventory-orders/inventory
 */
exports.createInventory = async (req, res) => {
  try {
    const tenantId = req.user.tenant;
    const item = await ManagerOrder.create({ ...req.body, tenant: tenantId });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update inventory item
 * @route   PUT /api/manager/inventory-orders/inventory/:id
 */
exports.updateInventory = async (req, res) => {
  try {
    const item = await ManagerOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete inventory item
 * @route   DELETE /api/manager/inventory-orders/inventory/:id
 */
exports.deleteInventory = async (req, res) => {
  try {
    const item = await ManagerOrder.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new order
 * @route   POST /api/manager/inventory-orders/order
 */
exports.createOrder = async (req, res) => {
  try {
    const tenantId = req.user.tenant;
    const order = await Order.create({ ...req.body, tenant: tenantId });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update order
 * @route   PUT /api/manager/inventory-orders/order/:id
 */
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete order
 * @route   DELETE /api/manager/inventory-orders/order/:id
 */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
