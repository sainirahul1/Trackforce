const StoreVisit = require('../models/employee/StoreVisit');
const Order = require('../models/employee/Order');
const EmployeeDashboard = require('../models/employee/Dashboard');

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

  // 1. Efficiency: % of visits with status "completed"
  const completedVisits = visits.filter(v => v.status === 'completed').length;
  const efficiency = Math.round((completedVisits / total) * 100);

  // 2. Reliability: % visits that were completed or partially_completed (not abandoned)
  const reliableVisits = visits.filter(v => v.status === 'completed' || v.status === 'partially_completed').length;
  const reliability = Math.round((reliableVisits / total) * 100);

  // 3. Speed: % visits where eta is within scheduled time
  // (approximated by: visit within business hours 9–18 AND notes mention no late reference)
  const speedVisits = visits.filter(v => {
    const visitHour = new Date(v.createdAt).getHours();
    const withinBusinessHours = visitHour >= 9 && visitHour <= 18;
    const noLateReference = !(v.notes && v.notes.toLowerCase().includes('late')); // Simplified check
    return withinBusinessHours && noLateReference;
  }).length;
  const speed = Math.round((speedVisits / total) * 100);

  // 4. Accuracy: % visits that have notes AND checklist length > 0 (data quality proxy)
  const accurateVisits = visits.filter(v => v.notes && v.checklist && v.checklist.length > 0).length;
  const accuracy = Math.round((accurateVisits / total) * 100);

  // 5. Engagement: unique stores visited / 7 (our catalogue) * 100
  const uniqueStores = new Set(visits.map(v => v.storeName)).size;
  const engagement = Math.min(100, Math.round((uniqueStores / 7) * 100));

  return [efficiency, reliability, speed, accuracy, engagement];
}

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
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days inclusive of today

    const recentOrders = await Order.find({
      tenant: req.tenantId,
      createdAt: { $gte: sevenDaysAgo }
    }).select('totalAmount createdAt');

    // Grouping into 7 days array.
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    let totalWeekly = 0;

    recentOrders.forEach(order => {
      const diffTime = today.getTime() - new Date(order.createdAt).setHours(0, 0, 0, 0);
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
      employee: req.user._id,
      tenant: req.tenantId,
      createdAt: { $gte: today },
      status: { $ne: 'completed' }
    }).sort({ createdAt: 1 });

    tasksToday = pendingVisits.length;

    if (pendingVisits.length > 0) {
      const visit = pendingVisits[0];
      nextTarget = {
        store: visit.storeName,
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

    res.json({
      visitsToday: visitCount,
      ordersToday: orderCount,
      tasksToday,
      revenueData: { weeklyData, totalWeekly },
      capabilities: dashSettings.capabilities,
      nextTarget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
