const User = require('../../models/tenant/User');
const Permission = require('../../models/superadmin/Permission');
const AuditLog = require('../../models/superadmin/AuditLog');

// @desc    Get counts for each role
// @route   GET /api/superadmin/roles/counts
// @access  Private/SuperAdmin
exports.getRoleCounts = async (req, res) => {
  try {
    const tenantCount = await User.countDocuments({ role: 'tenant' });
    const managerCount = await User.countDocuments({ role: 'manager' });
    const employeeCount = await User.countDocuments({ role: 'employee' });

    res.json({
      tenant: tenantCount,
      manager: managerCount,
      employee: employeeCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get permission matrix
// @route   GET /api/superadmin/permissions
// @access  Private/SuperAdmin
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update permission matrix
// @route   PUT /api/superadmin/permissions
// @access  Private/SuperAdmin
exports.updatePermissions = async (req, res) => {
  try {
    const { module, roleKey, allowed } = req.body;
    const permission = await Permission.findOneAndUpdate(
      { module },
      { [roleKey]: allowed },
      { new: true, upsert: true }
    );
    res.json(permission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get audit logs
// @route   GET /api/superadmin/audit-logs
// @access  Private/SuperAdmin
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create audit log entry
// @route   POST /api/superadmin/audit-logs
// @access  Private/SuperAdmin
exports.createAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.create(req.body);
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get users by role
// @route   GET /api/superadmin/manage/users/:role
// @access  Private/SuperAdmin
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    // Map human-readable role name back to DB role if necessary
    const roleMap = {
      'tenant admin': 'tenant',
      'tenant': 'tenant',
      'manager': 'manager',
      'employee': 'employee'
    };
    const dbRole = roleMap[role.toLowerCase()] || role.toLowerCase();
    
    const users = await User.find({ role: dbRole }).select('-password').limit(100);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
