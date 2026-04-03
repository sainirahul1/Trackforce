const ActivityLog = require('../../models/employee/ActivityLog');
const User = require('../../models/tenant/User');
const { logActivity } = require('../../utils/activityLogger');

// Get all executives (employees) for the current tenant
exports.getExecutives = async (req, res) => {
  try {
    const executives = await User.find({ 
      tenant: req.tenantId,
      role: 'employee'
    }).select('name role profile isTracking createdAt').lean();
    
    res.json(executives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get activity logs for a specific user
exports.getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await ActivityLog.find({ 
      tenant: req.tenantId,
      user: userId
    }).sort({ timestamp: -1 }).lean();
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Legacy/Bulk fetch (if needed)
exports.getActivities = async (req, res) => {
  try {
    const query = { tenant: req.tenantId };
    
    // STRICT SCOPING: If employee, only show their own activities
    if (req.user && req.user.role === 'employee') {
      query.user = req.user._id;
    }

    const activities = await ActivityLog.find(query)
      .populate('user', 'name role')
      .sort({ timestamp: -1 })
      .limit(30)
      .lean();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new activity log entry
exports.createActivity = async (req, res) => {
  try {
    const { type, details, title, status, metadata } = req.body;
    
    // Use the centralized logger to ensure Socket.io emission
    const newLog = await logActivity({
      userId: req.user._id,
      tenantId: req.tenantId,
      type,
      details,
      title,
      status: status || 'default',
      metadata: metadata || {}
    });

    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
