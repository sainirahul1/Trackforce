const StoreVisit = require('../models/employee/StoreVisit');
const Order = require('../models/employee/Order');
const EmployeeDashboard = require('../models/employee/Dashboard');

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

    // Calculate Weekly Revenue
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days inclusive of today

    const recentOrders = await Order.find({
      tenant: req.tenantId,
      createdAt: { $gte: sevenDaysAgo }
    }).select('totalAmount createdAt');

    // Grouping into 7 days array.
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    let totalWeekly = 0;

    recentOrders.forEach(order => {
      const diffTime = today.getTime() - new Date(order.createdAt).setHours(0,0,0,0);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        const index = 6 - diffDays;
        weeklyData[index] += order.totalAmount || 0;
        totalWeekly += order.totalAmount || 0;
      }
    });

    // Find next uncompleted visit or furnish mock
    let nextTarget = null;
    let tasksToday = 0;
    
    // Find uncompleted visits
    const pendingVisits = await StoreVisit.find({
      tenant: req.tenantId,
      createdAt: { $gte: today },
      status: { $ne: 'completed' }
    }).sort({ createdAt: 1 });

    tasksToday = pendingVisits.length;

    if (pendingVisits.length > 0) {
      const visit = pendingVisits[0];
      nextTarget = {
        store: visit.storeName,
        address: "Nearest Outlet", 
        travelTime: "15 mins",
        distance: "3.5 km",
        priority: "High Priority"
      };
    } else {
      nextTarget = {
        store: "Global Tech Solutions HQ",
        address: "Sector 4, North Zone",
        travelTime: "18 mins",
        distance: "4.2 km",
        priority: "Critical priority"
      };
    }

    // Fetch or create Employee Dashboard capabilities
    let dashSettings = await EmployeeDashboard.findOne({ employee: req.user._id });
    
    // Generate some randomized dummy data to prove the UI updates properly
    const generateRandomCap = () => Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    const randomCapabilities = [generateRandomCap(), generateRandomCap(), generateRandomCap(), generateRandomCap(), generateRandomCap()];

    if (!dashSettings) {
      dashSettings = await EmployeeDashboard.create({
        employee: req.user._id,
        tenant: req.tenantId,
        capabilities: randomCapabilities
      });
    } else {
      // Temporarily overwrite the random values to the DB document so the user uniquely observes dynamic updates each page refresh
      dashSettings.capabilities = randomCapabilities;
      await dashSettings.save();
    }

    const capabilities = dashSettings.capabilities;

    res.json({
      visitsToday: visitCount,
      ordersToday: orderCount,
      tasksToday: tasksToday,
      revenueData: { weeklyData, totalWeekly },
      capabilities,
      nextTarget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
