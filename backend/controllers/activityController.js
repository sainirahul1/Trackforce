const ActivityLog = require('../models/employee/ActivityLog');

// Get activity logs for the tenant
exports.getActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({ tenant: req.tenantId })
      .populate('user', 'name role')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new activity log
exports.createActivity = async (req, res) => {
  try {
    const { type, details } = req.body;
    const newLog = new ActivityLog({
      user: req.user._id,
      tenant: req.tenantId,
      type,
      details
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
