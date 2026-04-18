const ActivityLog = require('../models/employee/ActivityLog');
const Notification = require('../models/tenant/Notification');

let io;

/**
 * Initialize the logger with the Socket.io instance.
 * @param {object} ioInstance - The Socket.io instance.
 */
const initLogger = (ioInstance) => {
  io = ioInstance;
};

/**
 * Log an activity to the database and broadcast it via Socket.io.
 * @param {object} params - The log parameters.
 * @param {string} params.userId - The ID of the user performing the activity.
 * @param {string} params.tenantId - The tenant ID.
 * @param {string} params.type - The activity type.
 * @param {string} [params.title] - Human-readable title.
 * @param {string} [params.details] - Detailed description.
 * @param {string} [params.status] - Status (success, warning, info, default, urgent).
 * @param {object} [params.metadata] - Additional metadata.
 * @param {boolean} [params.notify] - Whether to create a formal notification for the user.
 * @param {string} [params.priority] - Notification priority (low, medium, high).
 */
const logActivity = async ({ userId, tenantId, type, title, details, status = 'default', metadata = {}, notify = false, priority = 'low' }) => {
  try {
    const logTitle = title || type.replace('_', ' ').toUpperCase();
    
    const newLog = new ActivityLog({
      user: userId,
      tenant: tenantId,
      type,
      title: logTitle,
      details,
      status,
      metadata,
      timestamp: new Date()
    });

    await newLog.save();

    // Broadcast to the user's private room only (Privacy)
    if (io) {
      io.to(`user:${userId}`).emit('activity:new', newLog);
      console.log(`[ACTIVITY] Logged and emitted to user: user:${userId}`);
    }

    // NEW: Formal Notification for isolation and alerting
    if (notify) {
      const newNotification = new Notification({
        recipient: userId,
        type: type.includes('task') ? 'task' : (type === 'alert' ? 'alert' : 'system'),
        title: logTitle,
        desc: details,
        priority: priority,
        metadata: metadata
      });

      await newNotification.save();

      if (io) {
        // Emit formal notification event for real-time alerting
        io.to(`user:${userId}`).emit('notification:new', newNotification);
        console.log(`[NOTIFICATION] Created and emitted to user: user:${userId}`);
      }
    }

    return newLog;
  } catch (error) {
    console.error('[ACTIVITY LOG ERROR]', error.message);
  }
};

module.exports = { initLogger, logActivity };
