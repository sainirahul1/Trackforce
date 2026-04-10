const User = require('../../models/tenant/User');
const TrackingSession = require('../../models/employee/TrackingSession');
const ActivityLog = require('../../models/employee/ActivityLog');
const { logActivity } = require('../../utils/activityLogger');

// Start tracking (On Duty)
exports.startTracking = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing active session
    let existingSession = await TrackingSession.findOne({ user: user._id, status: 'active' });

    // ENFORCE CONSISTENCY: Close any other "active" sessions besides the current one (if multiple exist)
    if (existingSession) {
      await TrackingSession.updateMany(
        { user: user._id, status: 'active', _id: { $ne: existingSession._id } },
        { $set: { status: 'completed', endTime: new Date() } }
      );
    }

    if (user.isTracking && existingSession) {
      return res.status(200).json({ message: 'Tracking already active', session: existingSession });
    }

    // Ensure user is marked as tracking
    user.isTracking = true;
    await user.save();

    // Create session if it doesn't exist
    if (!existingSession) {
      let managerName = '';
      if (user.manager) {
        const managerUser = await User.findById(user.manager);
        if (managerUser) managerName = managerUser.name;
      }

      existingSession = new TrackingSession({
        user: user._id,
        employeeName: user.name,
        manager: user.manager,
        managerName: managerName,
        tenant: req.tenantId,
        startTime: new Date(),
        status: 'active'
      });
      await existingSession.save();

      // Log activity using the centralized utility for real-time emission
      await logActivity({
        userId: user._id,
        tenantId: req.tenantId,
        type: 'shift_start',
        title: 'Shift Started',
        details: 'Employee is now On Duty and tracking has started.',
        status: 'success'
      });
      // Notify managers immediately that this employee is now On Duty
      const io = req.app.get('io');
      if (io) {
        io.to(`tenant:${req.tenantId.toString()}`).emit('tracking:start', {
          employeeId: user._id,
          employeeName: user.name,
          managerId: user.manager,
          tenantId: req.tenantId,
          timestamp: new Date()
        });
      }
    }

    res.status(200).json({ message: 'Tracking started', session: existingSession });
  } catch (err) {
    console.error('[DATABASE] Error in startTracking:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getActiveSessions = async (req, res) => {
  try {
    const employeeSessions = await TrackingSession.find({
      tenant: req.tenantId,
      status: 'active'
    }).populate({
      path: 'user',
      match: { isTracking: true }, // Removed role filter to include managers/tenants who start tracking
      select: 'name role isTracking'
    }).lean();

    // Remove any that didn't match the inner populate filter (only really active employees)
    const activeEmployees = employeeSessions.filter(s => s.user != null);

    res.status(200).json(activeEmployees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stop tracking (Off Duty)
exports.stopTracking = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.isTracking) {
      return res.status(400).json({ message: 'Tracking is not active' });
    }

    user.isTracking = false;
    await user.save();

    // Close ALL active sessions for this user to ensure consistency
    const result = await TrackingSession.updateMany(
      { user: user._id, status: 'active' },
      { $set: { status: 'completed', endTime: new Date() } }
    );

    // Log activity
    await logActivity({
      userId: user._id,
      tenantId: req.tenantId,
      type: 'shift_end',
      title: 'Shift Ended',
      details: 'Employee ended shift / Off Duty',
      status: 'warning'
    });
    await ActivityLog.create({
      user: user._id,
      tenant: req.tenantId,
      type: 'stop_tracking',
      details: 'Ended shift / Off Duty'
    });

    // Notify managers globally that this employee is now Off Duty
    const io = req.app.get('io');
    if (io) {
      io.to(`tenant:${req.tenantId.toString()}`).emit('tracking:stop', {
        employeeId: user._id,
        employeeName: user.name,
        timestamp: new Date()
      });
    }

    res.json({ message: 'Tracking stopped', result });
  } catch (error) {
    console.error('Error in stopTracking:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTrackingStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('isTracking tenant role manager name').lean();
    const activeSession = await TrackingSession.findOne({
      user: req.user._id,
      status: 'active'
    }).lean();

    res.json({
      isTracking: !!(user?.isTracking && activeSession),
      session: activeSession,
      user: {
        _id: user?._id,
        name: user?.name,
        tenant: user?.tenant || req.tenantId,
        role: user?.role,
        manager: user?.manager
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
