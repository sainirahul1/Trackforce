const TrackingSession = require('../models/employee/TrackingSession');
const User = require('../models/tenant/User');
const { logActivity } = require('../utils/activityLogger');

/**
 * Automatically closes tracking sessions that have been inactive for more than 8 hours.
 * This handles cases where employees forget to click 'Off Duty'.
 */
const cleanupStaleSessions = async (io) => {
  const STALE_THRESHOLD = 8 * 60 * 60 * 1000; // 8 Hours in ms
  const now = new Date();
  const thresholdTime = new Date(now.getTime() - STALE_THRESHOLD);

  try {
    console.log(`[MAINTENANCE] Running stale session cleanup... (Threshold: ${thresholdTime.toISOString()})`);

    // Find sessions that are 'active' but haven't been updated for 8+ hours
    const staleSessions = await TrackingSession.find({
      status: 'active',
      updatedAt: { $lt: thresholdTime }
    });

    if (staleSessions.length === 0) {
      console.log('[MAINTENANCE] No stale sessions found.');
      return;
    }

    console.log(`[MAINTENANCE] Found ${staleSessions.length} stale sessions to close.`);

    for (const session of staleSessions) {
      console.log(`[MAINTENANCE] Auto-closing session for ${session.employeeName || 'Unknown'} (Last update: ${session.updatedAt.toISOString()})`);

      // 1. Mark session as completed with requested audit fields
      session.status = 'completed';
      session.endTime = now;
      session.autoClosed = true;
      session.notTurnedOffLocation = true; // Field requested by user
      session.autoClosedAt = now;
      session.closureReason = 'Location not turned off (Auto-closed after 8h inactivity)';
      await session.save();

      // 2. Force the user to 'Off Duty' status in the User model
      await User.findByIdAndUpdate(session.user, { isTracking: false });

      // 3. Log Activity for Manager Audit Trail
      await logActivity({
        userId: session.user,
        tenantId: session.tenant,
        type: 'shift_end',
        title: 'Shift Ended (Auto-Closed)',
        details: `Location not turned off by employee. Session auto-terminated after 8h inactivity at ${now.toLocaleTimeString()}.`,
        status: 'warning',
        metadata: {
          sessionId: session._id,
          autoClosed: true,
          notTurnedOffLocation: true,
          durationHrs: 8
        }
      });

      // 4. Emit socket event
      if (io) {
        const tenantStr = session.tenant.toString();
        io.to(`tenant:${tenantStr}`).emit('tracking:stop', {
          employeeId: session.user,
          employeeName: session.employeeName,
          timestamp: now,
          autoClosed: true,
          notTurnedOffLocation: true
        });
      }
    }

    console.log('[MAINTENANCE] Cleanup complete.');
  } catch (err) {
    console.error('[MAINTENANCE ERROR] Failed to cleanup stale sessions:', err);
  }
};

module.exports = {
  cleanupStaleSessions
};
