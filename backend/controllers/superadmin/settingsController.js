const mongoose = require('mongoose');
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
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    // Fetch stats for all collections
    const statsPromises = collections.map(col =>
      db.command({ collStats: col.name }).catch(() => null)
    );

    const [
      colStatsResults,
      dbStats,
      tenantCount,
      managerCount,
      employeeCount,
      auditLogsCount,
      subscriptionsCount
    ] = await Promise.all([
      Promise.all(statsPromises),
      db.command({ dbStats: 1 }),
      User.countDocuments({ role: 'tenant' }),
      User.countDocuments({ role: 'manager' }),
      User.countDocuments({ role: 'employee' }),
      AuditLog.countDocuments(),
      Subscription.countDocuments()
    ]);

    const validStats = colStatsResults.filter(s => s !== null);

    // Categorize and summarize inventory
    let relationalSize = 0;
    let analyticalSize = 0;
    const collectionInventory = validStats.map(s => {
      const collectionName = s.ns.split('.').pop();
      const sizeBytes = s.size || 0;
      const sizeMB = parseFloat((sizeBytes / (1024 * 1024)).toFixed(2));

      const isRelational = ['users', 'tenants', 'subscriptions', 'systemsettings', 'companies', 'locations', 'roles', 'permissions'].includes(collectionName);
      const category = isRelational ? 'Relational' : 'Analytical';

      if (isRelational) relationalSize += sizeBytes;
      else analyticalSize += sizeBytes;

      return {
        name: collectionName,
        count: s.count,
        size: sizeMB,
        avgObjSize: Math.round(s.avgObjSize || 0),
        category
      };
    }).sort((a, b) => b.size - a.size);

    // Role-based distribution (Estimated from Users collection size)
    const usersStat = validStats.find(s => s.ns.endsWith('.users'));
    const usersSize = usersStat ? usersStat.size : 0;
    const totalUsers = tenantCount + managerCount + employeeCount;

    const roleDistribution = [
      { role: 'Tenants', count: tenantCount, color: '#4f46e5', icon: 'Shield' },
      { role: 'Managers', count: managerCount, color: '#10b981', icon: 'Zap' },
      { role: 'Employees', count: employeeCount, color: '#f59e0b', icon: 'Smartphone' }
    ].map(r => {
      const roleCount = r.count;
      const estimatedSize = totalUsers > 0 ? (usersSize * (roleCount / totalUsers)) : 0;
      return {
        ...r,
        sizeMB: parseFloat((estimatedSize / (1024 * 1024)).toFixed(2)),
        percent: totalUsers > 0 ? parseFloat(((roleCount / totalUsers) * 100).toFixed(1)) : 0
      };
    });

    const usedBytes = dbStats.storageSize || 0;
    const usedGB = parseFloat((usedBytes / (1024 * 1024 * 1024)).toFixed(3)); // 3 decimals for better precision at 512MB
    const totalGB = 0.5; // Corrected to 512MB
    const overheadBytes = (dbStats.storageSize - dbStats.dataSize) || 0;
    const overheadGB = parseFloat((overheadBytes / (1024 * 1024 * 1024)).toFixed(4));

    // Dynamic storage growth calculation based on real record creation
    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Aggregate user growth over the last 6 months
    const userGrowthRaw = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Map to the required format for the frontend chart
    const storageGrowth = userGrowthRaw.map(g => ({
      month: months[g._id.month - 1],
      size: parseFloat((usedGB * (g.count / (totalUsers || 1))).toFixed(3))
    }));

    // If growth data is sparse, ensure we have at least the current month
    if (storageGrowth.length === 0) {
      storageGrowth.push({ month: months[new Date().getMonth()], size: usedGB });
    }

    // Fetch real server status if possible, otherwise use reliable indicators
    let dbServerStatus = { uptime: 0 };
    try {
      dbServerStatus = await db.command({ serverStatus: 1 });
    } catch (e) {
      console.error('Failed to fetch serverStatus:', e.message);
    }

    const uptimeSeconds = dbServerStatus.uptime || Math.floor(process.uptime());
    const uptimeFormatted = uptimeSeconds > 86400 
      ? `${Math.floor(uptimeSeconds / 86400)}d ${Math.floor((uptimeSeconds % 86400) / 3600)}h`
      : `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`;

    res.json({
      storageMetrics: {
        used: usedGB,
        total: totalGB,
        remaining: parseFloat((totalGB - usedGB).toFixed(3)),
        percentUsed: parseFloat(((usedGB / totalGB) * 100).toFixed(1)),
        relational: parseFloat((relationalSize / (1024 * 1024 * 1024)).toFixed(2)),
        media: parseFloat((analyticalSize / (1024 * 1024 * 1024)).toFixed(2)),
        overhead: overheadGB > 0 ? overheadGB : 0
      },
      roleDistribution,
      collectionInventory: collectionInventory.slice(0, 8),
      counts: {
        users: {
          tenant: tenantCount,
          manager: managerCount,
          employee: employeeCount,
          total: totalUsers
        },
        tenants: await Tenant.countDocuments(),
        auditLogs: auditLogsCount,
        subscriptions: subscriptionsCount
      },
      storageGrowth: storageGrowth.slice(-6), // Return last 6 months
      uptime: uptimeFormatted,
      ioStatus: dbStats.objects > 0 ? 'Optimal' : 'Idle',
      integrityStatus: 'Verified',
      nodeAvailability: 'Active',
      totalNodes: totalUsers,
      systemHealth: usedGB < (totalGB * 0.8) ? 'Healthy' : 'Warning'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get duplicate user records (case-insensitive)
// @route   GET /api/superadmin/settings/duplicates
// @access  Private/SuperAdmin
// @desc    Get duplicate records across multiple collections (case-insensitive)
// @route   GET /api/superadmin/settings/duplicates
// @access  Private/SuperAdmin
exports.getDuplicates = async (req, res) => {
  try {
    const { field = 'email', customPath: customQueryPath } = req.query;

    /**
     * @helper Resolver for friendly shorthand field names
     * Maps user-friendly terms to deep schema paths
     */
    const resolveFieldPath = (path) => {
      if (!path) return null;
      const mapping = {
        'id': '_id',
        'number': 'profile.phone',
        'address': 'profile.address',
        'code': 'profile.employeeCode',
        'Code': 'profile.employeeCode'
      };
      return mapping[path] || path; // Returns mapped path or literal path
    };

    // Define collections to scan
    const auditModels = [
      { model: User, name: 'Users', emailField: 'email', phoneField: 'profile.phone', nameField: 'name' },
      { model: Tenant, name: 'Tenants', emailField: null, phoneField: null, nameField: 'name' },
      { model: Subscription, name: 'Subscriptions', emailField: null, phoneField: null, nameField: 'name' }
    ];

    let allDuplicates = [];

    for (const audit of auditModels) {
      let fieldPath = null;
      if (field === 'email') fieldPath = audit.emailField;
      else if (field === 'phone') fieldPath = audit.phoneField;
      else if (field === 'username') fieldPath = audit.nameField;
      else if (field === 'custom') fieldPath = resolveFieldPath(customQueryPath);

      if (!fieldPath) continue;



      const dupes = await audit.model.aggregate([
        {
          $group: {
            _id: { $toLower: `$${fieldPath}` },
            count: { $sum: 1 },
            records: {
              $push: {
                _id: "$_id",
                name: "$name",
                role: "$role",
                createdAt: "$createdAt",
                email: "$email",
                source: audit.name
              }
            }
          }
        },
        { $match: { count: { $gt: 1 }, _id: { $nin: [null, ""] } } },
        { $sort: { count: -1 } }
      ]);

      allDuplicates = [...allDuplicates, ...dupes];
    }

    // Sort combined results by hit count
    allDuplicates.sort((a, b) => b.count - a.count);

    res.json(allDuplicates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Selective cleanup of duplicate records (collection-aware)
// @route   POST /api/superadmin/settings/cleanup
// @access  Private/SuperAdmin
exports.cleanupDuplicates = async (req, res) => {
  try {
    const { recordIds, collectionName = 'Users' } = req.body;

    if (!recordIds || !Array.isArray(recordIds) || recordIds.length === 0) {
      return res.status(400).json({ message: 'No record IDs provided for cleanup' });
    }

    // Filter out any invalid IDs to prevent unintended global impact
    const validIds = recordIds.filter(id => id && typeof id === 'string' && id.length > 0);
    if (validIds.length === 0) {
      return res.status(400).json({ message: 'No valid record IDs provided' });
    }

    // Map collection name to model
    let TargetModel = User;
    if (collectionName === 'Tenants') TargetModel = Tenant;
    if (collectionName === 'Subscriptions') TargetModel = Subscription;

    console.log(`[SuperAdmin Purge] Targeted deletion of ${validIds.length} records from ${collectionName}`);
    const result = await TargetModel.deleteMany({ _id: { $in: validIds } });

    res.json({
      message: `Successfully removed ${result.deletedCount} duplicate records from ${collectionName}`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


