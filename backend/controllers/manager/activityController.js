const ManagerActivity = require('../../models/manager/ManagerActivity');

// Get all activities for the current logged-in manager
exports.getManagerActivities = async (req, res) => {
  try {
    const activities = await ManagerActivity.find({ 
      tenant: req.tenantId,
      user: req.user._id 
    })
    .sort({ timestamp: -1 })
    .limit(50);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new manager activity log entry
exports.createManagerActivity = async (req, res) => {
  try {
    const { type, details, title, status } = req.body;
    
    // FIRST LOGIN OF THE DAY LOGIC
    if (type === 'login') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const existingLogin = await ManagerActivity.findOne({
        user: req.user._id,
        tenant: req.tenantId,
        type: 'login',
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });

      if (existingLogin) {
        return res.status(200).json({ 
          message: 'Login already recorded for today', 
          activity: existingLogin 
        });
      }
    }

    const newLog = new ManagerActivity({
      user: req.user._id,
      tenant: req.tenantId,
      type,
      details,
      title,
      status
    });
    
    await newLog.save();
    
    // Optional: Emit socket event if needed for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(`tenant_${req.tenantId}`).emit('new_manager_activity', newLog);
    }

    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
