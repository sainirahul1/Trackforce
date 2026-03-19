const StoreVisit = require('../models/employee/StoreVisit');
const Order = require('../models/employee/Order');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitCount = await StoreVisit.countDocuments({
      tenant: req.tenantId,
      createdAt: { $gte: today }
    });

    const orderCount = await Order.countDocuments({
      tenant: req.tenantId,
      createdAt: { $gte: today }
    });

    // For "Active Hours", we could sum up TrackingSessions for today
    // For simplicity now, just return these counts
    res.json({
      visitsToday: visitCount,
      ordersToday: orderCount,
      tasksToday: 0 // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
