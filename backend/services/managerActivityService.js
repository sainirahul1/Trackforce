const ManagerActivity = require('../models/manager/ManagerActivity');

class ManagerActivityService {
  async getManagerActivities(tenantId, userId) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const activities = await ManagerActivity.find({ 
      tenant: tenantId,
      user: userId 
    })
    .sort({ timestamp: -1 })
    .limit(50);
    
    return activities;
  }

  async createManagerActivity(tenantId, userId, activityData, io) {
    if (!tenantId) throw new Error('Tenant isolation missing');
    
    const { type, details, title, status } = activityData;

    // FIRST LOGIN OF THE DAY LOGIC
    if (type === 'login') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const existingLogin = await ManagerActivity.findOne({
        user: userId,
        tenant: tenantId,
        type: 'login',
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });

      if (existingLogin) {
        return { isExisting: true, activity: existingLogin };
      }
    }

    const newLog = new ManagerActivity({
      user: userId,
      tenant: tenantId,
      type,
      details,
      title,
      status
    });
    
    await newLog.save();
    
    if (io) {
      io.to(`tenant_${tenantId}`).emit('new_manager_activity', newLog);
    }

    return { isExisting: false, activity: newLog };
  }
}

module.exports = new ManagerActivityService();
