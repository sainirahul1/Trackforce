const StoreVisit = require('../../models/employee/StoreVisit');
const Order = require('../../models/employee/Order');
const Task = require('../../models/employee/Task');
const ActivityLog = require('../../models/employee/ActivityLog');
const Target = require('../../models/employee/Target');
const EmployeeLogVisit = require('../../models/employee/EmployeeLogVisit');
const User = require('../../models/tenant/User');

// @desc    Get dashboard stats for employee
// @route   GET /api/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [visits, orders, tasks, target, visitsCount, freshUser] = await Promise.all([
      StoreVisit.find({ 
        employee: userId, 
        createdAt: { $gte: today } 
      }),
      Order.countDocuments({ 
        employee: userId, 
        createdAt: { $gte: today } 
      }),
      Task.find({ 
        employee: userId, 
        createdAt: { $gte: today } 
      }),
      Target.findOne({
        employee: userId,
        date: { $gte: today, $lte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999) }
      }),
      EmployeeLogVisit.countDocuments({
        employee: userId,
        timestamp: { $gte: today }
      }),
      User.findById(userId).select('-password').lean()
    ]);

    const currentTarget = target ? target.monthlyTarget : 0;
    const monthlyVisits = visitsCount;

    const totalVisitsToday = visits.length;
    const visitsCompleted = visits.filter(v => v.status === 'completed').length;
    const totalTasksToday = tasks.length;
    const tasksCompleted = tasks.filter(t => t.status === 'completed').length;

    // Calculate Weekly Revenue (Last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        last7Days.push(d);
    }

    const weeklyOrders = await Order.find({
        employee: userId,
        createdAt: { $gte: last7Days[0] }
    });

    const weeklyData = last7Days.map(day => {
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        return weeklyOrders
            .filter(o => o.createdAt >= day && o.createdAt < nextDay)
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    });

    const totalWeekly = weeklyData.reduce((sum, v) => sum + v, 0);

    // Calculate DYNAMIC capabilities (Last 30 days history)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const [historicalTasks, historicalLogs] = await Promise.all([
        Task.find({ employee: userId, createdAt: { $gte: monthAgo } }),
        ActivityLog.countDocuments({ user: userId, createdAt: { $gte: monthAgo } })
    ]);

    const taskSuccessRate = historicalTasks.length > 0 
        ? Math.round((historicalTasks.filter(t => t.status === 'completed').length / historicalTasks.length) * 100)
        : 80;
    
    const logEngagement = Math.min(100, Math.round((historicalLogs / 50) * 100)); // Target 50 logs/month

    const capabilities = [
        taskSuccessRate, // Efficiency
        Math.min(100, Math.round(visitsCompleted / (totalVisitsToday || 1) * 100)) || 85, // Reliability (today's pace)
        90, // Speed (Mocked for now)
        95, // Accuracy (Mocked for now)
        logEngagement // Engagement
    ];

    // Find next target (highest priority pending task)
    const nextTask = await Task.findOne({
        employee: userId,
        status: { $in: ['pending', 'in-progress'] }
    }).sort({ priority: -1, createdAt: 1 });

    res.json({
      visitsToday: totalVisitsToday,
      ordersToday: orders,
      tasksToday: totalTasksToday,
      visitsCompleted,
      tasksCompleted,
      revenueData: { 
        weeklyData, 
        totalWeekly 
      },
      capabilities,
      nextTarget: nextTask ? {
        store: nextTask.store,
        address: nextTask.address || 'Location assigned',
        priority: nextTask.priority,
        travelTime: 'Est. 25m',
        distance: '4.2 km'
      } : null,
      monthlyTarget: currentTarget,
      monthlyVisits: monthlyVisits,
      user: freshUser
    });
  } catch (error) {
    console.error('[STATS ERROR]', error.message);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
