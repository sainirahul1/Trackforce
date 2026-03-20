const SystemSetting = require('../../models/superadmin/SystemSetting');
const User = require('../../models/tenant/User');
const Tenant = require('../../models/superadmin/Tenant');
const AuditLog = require('../../models/superadmin/AuditLog');
const Subscription = require('../../models/superadmin/Subscription');

// @desc    Get system settings
// @route   GET /api/superadmin/settings
// @access  Private/SuperAdmin
exports.getSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/superadmin/settings
// @access  Private/SuperAdmin
exports.updateSettings = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const settings = await SystemSetting.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get database analytics
// @route   GET /api/superadmin/settings/analytics
// @access  Private/SuperAdmin
exports.getDatabaseAnalytics = async (req, res) => {
  try {
    const [
      tenantCount,
      managerCount,
      employeeCount,
      totalTenants,
      auditLogsCount,
      subscriptionsCount
    ] = await Promise.all([
      User.countDocuments({ role: 'tenant' }),
      User.countDocuments({ role: 'manager' }),
      User.countDocuments({ role: 'employee' }),
      Tenant.countDocuments(),
      AuditLog.countDocuments(),
      Subscription.countDocuments()
    ]);

    // Mock storage growth data for charts
    const storageGrowth = [
      { month: 'Oct', size: 1.2 },
      { month: 'Nov', size: 2.1 },
      { month: 'Dec', size: 3.5 },
      { month: 'Jan', size: 5.2 },
      { month: 'Feb', size: 7.8 },
      { month: 'Mar', size: 10.4 }
    ];

    res.json({
      counts: {
        users: {
          tenant: tenantCount,
          manager: managerCount,
          employee: employeeCount,
          total: tenantCount + managerCount + employeeCount
        },
        tenants: totalTenants,
        auditLogs: auditLogsCount,
        subscriptions: subscriptionsCount
      },
      storageGrowth,
      storageMetrics: {
        used: 10.4, // GB
        total: 50.0, // GB
        remaining: 39.6, // GB
        percentUsed: 20.8
      },
      systemHealth: 'optimal',
      uptime: '99.98%'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
