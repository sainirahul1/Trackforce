const Tenant = require('../../models/superadmin/Tenant');
const User = require('../../models/tenant/User');
const StoreVisit = require('../../models/employee/StoreVisit');

// @desc    Get global platform stats
// @route   GET /api/superadmin/analytics/stats
// @access  Private/SuperAdmin
exports.getGlobalStats = async (req, res) => {
  try {
    const totalTenants = await Tenant.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalVisits = await StoreVisit.countDocuments();
    
    // Calculate Monthly Revenue (Mock calculation for now)
    // In a real app, you'd aggregate from a Payments collection
    const activeTenants = await Tenant.find({ onboardingStatus: 'active' });
    let totalMRR = 0;
    activeTenants.forEach(t => {
      if (t.subscription.plan === 'enterprise') totalMRR += 499;
      else if (t.subscription.plan === 'premium') totalMRR += 149;
      else totalMRR += 49;
    });

    const recentCompanies = await Tenant.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalTenants,
      totalUsers,
      totalVisits,
      totalMRR,
      growth: '+12.5%',
      recentCompanies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company onboarding growth (monthly)
// @route   GET /api/superadmin/analytics/growth
// @access  Private/SuperAdmin
exports.getOnboardingGrowth = async (req, res) => {
  try {
    const growth = await Tenant.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(growth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
