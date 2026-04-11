const Order = require('../models/employee/Order');
const ManagerOrder = require('../models/manager/ManagerOrder');
const User = require('../models/tenant/User');
const mongoose = require('mongoose');

class InventoryOrderService {
  async getTeamEmployeeIds(managerId, tenantId) {
    const employees = await User.find({ manager: managerId, tenant: tenantId }, '_id').lean();
    return employees.map(emp => emp._id);
  }

  async getDashboardStats(tenantId, managerId) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const teamEmployeeIds = await this.getTeamEmployeeIds(managerId, tenantId);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

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

    return {
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
    };
  }

  async getRevenueChartData(tenantId, managerId) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const teamEmployeeIds = await this.getTeamEmployeeIds(managerId, tenantId);

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

    return {
      success: true,
      data: { labels, data }
    };
  }

  async getRecentOrders(tenantId, managerId, search, page = 1, limit = 5) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const tId = new mongoose.Types.ObjectId(tenantId);
    const mId = new mongoose.Types.ObjectId(managerId);
    const teamEmployeeIds = [mId, ...(await this.getTeamEmployeeIds(mId, tId))];

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { 
      tenant: tId, 
      employee: { $in: teamEmployeeIds }
    };

    if (search) {
      const matchingEmployees = await User.find({
        _id: { $in: teamEmployeeIds },
        name: { $regex: search, $options: 'i' }
      }, '_id').lean();
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
      .limit(limitNum)
      .lean();

    const formattedOrders = orders.map(order => ({
      id: `ORD-${order._id.toString().slice(-4).toUpperCase()}`,
      store: order.storeName,
      executive: order.employee ? order.employee.name : 'Unknown',
      items: order.items,
      amount: '₹' + order.totalAmount.toLocaleString(),
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      date: order.timestamp
    }));

    return { 
      success: true, 
      data: formattedOrders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limitNum),
        currentPage: pageNum,
        limit: limitNum
      }
    };
  }

  async getExportLedgerData(tenantId, managerId) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    const teamEmployeeIds = await this.getTeamEmployeeIds(managerId, tenantId);

    const orders = await Order.find({
      tenant: tenantId,
      employee: { $in: teamEmployeeIds }
    }).populate('employee', 'name');

    if (orders.length === 0) {
      return null;
    }

    let csv = 'Order ID,Store Name,Executive,Items,Amount,Status,Date,Payment Method\n';
    orders.forEach(order => {
      csv += `${order._id},"${order.storeName}","${order.employee ? order.employee.name : 'N/A'}",${order.items},${order.totalAmount},${order.status},${order.timestamp.toISOString().split('T')[0]},${order.paymentMethod}\n`;
    });

    return csv;
  }

  async getInventory(tenantId) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    const inventory = await ManagerOrder.find({ tenant: tenantId }).lean();
    return { success: true, data: inventory };
  }

  async createInventory(tenantId, itemData) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    const item = await ManagerOrder.create({ ...itemData, tenant: tenantId });
    return { success: true, data: item };
  }

  async updateInventory(tenantId, itemId, updateData) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    // Ensure item belongs to tenant before update
    const itemToUpdate = await ManagerOrder.findOne({ _id: itemId, tenant: tenantId });
    if (!itemToUpdate) throw new Error('Item not found');
    
    const item = await ManagerOrder.findByIdAndUpdate(itemId, updateData, { new: true, runValidators: true });
    return { success: true, data: item };
  }

  async deleteInventory(tenantId, itemId) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    const item = await ManagerOrder.findOneAndDelete({ _id: itemId, tenant: tenantId });
    if (!item) throw new Error('Item not found');
    return { success: true, message: 'Item deleted' };
  }

  async createOrder(tenantId, orderData) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    const order = await Order.create({ ...orderData, tenant: tenantId });
    return { success: true, data: order };
  }

  async updateOrder(tenantId, orderId, updateData) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    const orderToUpdate = await Order.findOne({ _id: orderId, tenant: tenantId });
    if (!orderToUpdate) throw new Error('Order not found');

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true, runValidators: true });
    return { success: true, data: order };
  }

  async deleteOrder(tenantId, orderId) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    const order = await Order.findOneAndDelete({ _id: orderId, tenant: tenantId });
    if (!order) throw new Error('Order not found');
    return { success: true, message: 'Order deleted' };
  }
}

module.exports = new InventoryOrderService();
