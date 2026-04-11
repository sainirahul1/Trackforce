const managerActivityService = require('../../services/managerActivityService');

// Get all activities for the current logged-in manager
exports.getManagerActivities = async (req, res) => {
  try {
    const activities = await managerActivityService.getManagerActivities(req.tenantId, req.user._id);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new manager activity log entry
exports.createManagerActivity = async (req, res) => {
  try {
    const io = req.app.get('io');
    const result = await managerActivityService.createManagerActivity(req.tenantId, req.user._id, req.body, io);
    
    if (result.isExisting) {
      return res.status(200).json({ 
        message: 'Login already recorded for today', 
        activity: result.activity 
      });
    }

    res.status(201).json(result.activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
