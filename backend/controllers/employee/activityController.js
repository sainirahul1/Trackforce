const ActivityLog = require('../../models/employee/ActivityLog');
const User = require('../../models/tenant/User');

// Get all executives (employees) for the current tenant
exports.getExecutives = async (req, res) => {
  try {
    const executives = await User.find({ 
      tenant: req.tenantId,
      role: 'employee'
    }).select('name role profile isTracking createdAt');
    
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
    }).sort({ timestamp: -1 });
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Legacy/Bulk fetch (if needed)
exports.getActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({ tenant: req.tenantId })
      .populate('user', 'name role')
      .sort({ timestamp: -1 })
      .limit(15);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new activity log entry
exports.createActivity = async (req, res) => {
  try {
    const { type, details, title, status, metadata } = req.body;
    const newLog = new ActivityLog({
      user: req.user._id,
      tenant: req.tenantId,
      type,
      details,
      title,
      status,
      metadata
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
