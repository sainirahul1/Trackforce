const Order = require('../models/employee/Order');
const ManagerOrder = require('../models/manager/ManagerOrder');
const User = require('../models/tenant/User');
const mongoose = require('mongoose');

class InventoryOrderService {
  async getTeamEmployeeIds(managerId, tenantId) {
    // Ensure we work with ObjectIds
    const mId = new mongoose.Types.ObjectId(managerId);
    const tId = new mongoose.Types.ObjectId(tenantId);

    const employees = await User.find({ 
      $or: [
        { manager: mId },
        { _id: mId }
      ], 
      tenant: tId 
    }, '_id').lean();
    return employees.map(emp => emp._id);
  }

  async getDashboardStats(tenantId, managerId, userRole) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    // Managers and Admins both see the "Big Picture" in this dashboard
    const hasFullVisibility = ['tenant', 'manager', 'superadmin'].includes(userRole?.toLowerCase());
    const teamEmployeeIds = hasFullVisibility ? null : await this.getTeamEmployeeIds(managerId, tenantId);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const matchQuery = {
      tenant: new mongoose.Types.ObjectId(tenantId),
      createdAt: { $gte: sevenDaysAgo },
      status: { $ne: 'canceled' }
    };

    if (!hasFullVisibility) {
      matchQuery.employee = { $in: teamEmployeeIds };
    }

    const stats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          weeklyRevenue: { $sum: '$totalAmount' },
          ordersCollected: { $count: {} },
          avgTicketSize: { $avg: '$totalAmount' }
        }
      }
    ]);

    const revenueByEmployee = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$employee',
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const prevMatchQuery = {
      tenant: new mongoose.Types.ObjectId(tenantId),
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
      status: { $ne: 'canceled' }
    };

    if (!hasFullVisibility) {
      prevMatchQuery.employee = { $in: teamEmployeeIds };
    }

    const prevStats = await Order.aggregate([
      { $match: prevMatchQuery },
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

    const pendingQuery = {
      tenant: tenantId,
      status: { $in: ['pending', 'processing'] }
    };

    if (!hasFullVisibility) {
      pendingQuery.employee = { $in: teamEmployeeIds };
    }

    const pendingApprovalCount = await Order.countDocuments(pendingQuery);

    const calculateTrend = (curr, prev) => {
      if (!prev || prev === 0) return curr > 0 ? '+100%' : '+0%';
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
        revenueByEmployee: revenueByEmployee.reduce((acc, curr) => {
          if (curr._id) acc[curr._id.toString()] = curr.totalRevenue;
          return acc;
        }, {})
      }
    };
  }

  async getRevenueChartData(tenantId, managerId, userRole) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const tId = new mongoose.Types.ObjectId(tenantId);
    const hasFullVisibility = ['tenant', 'manager', 'superadmin'].includes(userRole?.toLowerCase());

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const matchQuery = {
      tenant: tId,
      createdAt: { $gte: sevenDaysAgo },
      status: { $ne: 'canceled' }
    };

    if (!hasFullVisibility) {
      const teamEmployeeIds = await this.getTeamEmployeeIds(managerId, tenantId);
      matchQuery.employee = { $in: teamEmployeeIds };
    }

    const chartData = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
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

  async getRecentOrders(tenantId, managerId, userRole, search, page = 1, limit = 5) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const tId = new mongoose.Types.ObjectId(tenantId);
    const hasFullVisibility = ['tenant', 'manager', 'superadmin'].includes(userRole?.toLowerCase());

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { tenant: tId };

    let teamEmployeeIds = [];
    if (!hasFullVisibility) {
      const mId = new mongoose.Types.ObjectId(managerId);
      teamEmployeeIds = await this.getTeamEmployeeIds(mId, tId);
      query.employee = { $in: teamEmployeeIds };
    }

    if (search) {
      const searchTerms = [
        { storeName: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];

      // Only search by employee name if we have the list or are admin
      const userSearchQuery = { name: { $regex: search, $options: 'i' }, tenant: tId };
      if (!hasFullVisibility) {
        userSearchQuery._id = { $in: teamEmployeeIds };
      }

      const matchingEmployees = await User.find(userSearchQuery, '_id').lean();
      if (matchingEmployees.length > 0) {
        searchTerms.push({ employee: { $in: matchingEmployees.map(e => e._id) } });
      }

      query.$or = searchTerms;
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('employee', 'name email status profile')
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

  async getExportLedgerData(tenantId, managerId, userRole) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    
    const hasFullVisibility = ['tenant', 'manager', 'superadmin'].includes(userRole?.toLowerCase());
    const query = { tenant: tenantId };

    if (!hasFullVisibility) {
      const teamEmployeeIds = await this.getTeamEmployeeIds(managerId, tenantId);
      query.employee = { $in: teamEmployeeIds };
    }

    const orders = await Order.find(query).populate('employee', 'name');

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
