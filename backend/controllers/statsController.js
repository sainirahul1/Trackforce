const StoreVisit = require('../models/employee/StoreVisit');
const Order = require('../models/employee/Order');
const EmployeeDashboard = require('../models/employee/Dashboard');
<<<<<<< HEAD
=======

/**
 * Compute Field Mastery Capabilities from the last 30 days of store visits.
 *
 * Returns an array of 5 scores mapped to:
 * [Efficiency, Reliability, Speed, Accuracy, Engagement]
 *
 * Scoring parameters:
 *  1. Efficiency  – % of visits with status "completed"
 *  2. Reliability – % visits that were completed or partially_completed (not abandoned)
 *  3. Speed       – % visits where eta is within scheduled time
 *                   (approximated by: visit within business hours 9–18 AND notes mention no late reference)
 *  4. Accuracy    – % visits that have notes AND checklist length > 0 (data quality proxy)
 *  5. Engagement  – unique stores visited / 7 (our catalogue) * 100
 */
async function computeCapabilitiesFromDB(employeeId, tenantId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const visits = await StoreVisit.find({
    employee: employeeId,
    tenant: tenantId,
    createdAt: { $gte: thirtyDaysAgo }
  }).lean();

  if (!visits.length) return [0, 0, 0, 0, 0]; // Show empty/zero if no data available

  const total = visits.length;

  // 1. Efficiency: Weighted Status Sum / Total
  // Weights: completed: 1, pending: 0.5, incomplete: 0.2, rejected: 0
  const statusWeights = { completed: 1, pending: 0.5, incomplete: 0.2, rejected: 0 };
  const weightedStatus = visits.reduce((acc, v) => acc + (statusWeights[v.status] || 0), 0);
  const efficiency = Math.round((weightedStatus / total) * 100);

  // 2. Reliability: % of onTime: 'completed' (not delayed)
  const onTimeCount = visits.filter(v => v.onTime === 'completed').length;
  const reliability = Math.round((onTimeCount / total) * 100);

  // 3. Speed: Distribution of onTime visits across work hours (9-18)
  // Higher weight if onTime: 'completed' AND within prime hours
  const speedScore = visits.reduce((acc, v) => {
    let score = v.onTime === 'completed' ? 1 : 0.4;
    const h = new Date(v.createdAt).getHours();
    if (h >= 9 && h <= 18) score *= 1;
    else score *= 0.7; // slight penalty for off-hours visits if they were meant to be on-shift
    return acc + score;
  }, 0);
  const speed = Math.round((speedScore / total) * 100);

  // 4. Accuracy: % of isConsistent: 'consistent'
  const consistentCount = visits.filter(v => v.isConsistent === 'consistent').length;
  const accuracy = Math.round((consistentCount / total) * 100);

  // 5. Engagement: unique stores visited / 10 (target breadth) * 100
  const uniqueStores = new Set(visits.map(v => v.storeName)).size;
  const engagement = Math.min(100, Math.round((uniqueStores / 10) * 100));

  return [efficiency, reliability, speed, accuracy, engagement];
}
>>>>>>> emp-dash

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitCount = await StoreVisit.countDocuments({
      employee: req.user._id,
      tenant: req.tenantId,
      createdAt: { $gte: today }
    });

    const orderCount = await Order.countDocuments({
      tenant: req.tenantId,
      createdAt: { $gte: today }
    });

    // Calculate Weekly Revenue
    const sevenDaysAgo = new Date(today);
<<<<<<< HEAD
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days inclusive of today
=======
    sevenDaysAgo.setDate(today.getDate() - 6);
>>>>>>> emp-dash

    const recentOrders = await Order.find({
      tenant: req.tenantId,
      createdAt: { $gte: sevenDaysAgo }
    }).select('totalAmount createdAt');

<<<<<<< HEAD
    // Grouping into 7 days array.
=======
>>>>>>> emp-dash
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    let totalWeekly = 0;

    recentOrders.forEach(order => {
<<<<<<< HEAD
      const diffTime = today.getTime() - new Date(order.createdAt).setHours(0,0,0,0);
=======
      const diffTime = today.getTime() - new Date(order.createdAt).setHours(0, 0, 0, 0);
>>>>>>> emp-dash
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        const index = 6 - diffDays;
        weeklyData[index] += order.totalAmount || 0;
        totalWeekly += order.totalAmount || 0;
      }
    });

<<<<<<< HEAD
    // Find next uncompleted visit or furnish mock
    let nextTarget = null;
    let tasksToday = 0;
    
    // Find uncompleted visits
    const pendingVisits = await StoreVisit.find({
=======
    // Find next uncompleted visit
    let nextTarget = null;
    let tasksToday = 0;

    const pendingVisits = await StoreVisit.find({
      employee: req.user._id,
>>>>>>> emp-dash
      tenant: req.tenantId,
      createdAt: { $gte: today },
      status: { $ne: 'completed' }
    }).sort({ createdAt: 1 });

    tasksToday = pendingVisits.length;

    if (pendingVisits.length > 0) {
      const visit = pendingVisits[0];
      nextTarget = {
        store: visit.storeName,
<<<<<<< HEAD
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
=======
        address: visit.address || 'Nearest Outlet',
        travelTime: visit.eta || '15 mins',
        distance: visit.distance || '3.5 km',
        priority: 'High Priority'
      };
    } else {
      nextTarget = {
        store: 'Global Tech Solutions HQ',
        address: 'Sector 4, North Zone',
        travelTime: '18 mins',
        distance: '4.2 km',
        priority: 'Critical priority'
      };
    }

    // Compute capabilities from real visit data, then persist to DB
    const computedCaps = await computeCapabilitiesFromDB(req.user._id, req.tenantId);

    const dashSettings = await EmployeeDashboard.findOneAndUpdate(
      { employee: req.user._id },
      { employee: req.user._id, tenant: req.tenantId, capabilities: computedCaps },
      { upsert: true, new: true }
    );
>>>>>>> emp-dash

    res.json({
      visitsToday: visitCount,
      ordersToday: orderCount,
<<<<<<< HEAD
      tasksToday: tasksToday,
      revenueData: { weeklyData, totalWeekly },
      capabilities,
=======
      tasksToday,
      revenueData: { weeklyData, totalWeekly },
      capabilities: dashSettings.capabilities,
>>>>>>> emp-dash
      nextTarget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
