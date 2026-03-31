const User = require('../models/tenant/User');
const TrackingSession = require('../models/employee/TrackingSession');
const ActivityLog = require('../models/employee/ActivityLog');

// Start tracking (On Duty)
exports.startTracking = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing active session
    let existingSession = await TrackingSession.findOne({ user: user._id, status: 'active' });

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

      // Log activity
      await ActivityLog.create({
        user: user._id,
        tenant: req.tenantId,
        type: 'start_tracking',
        details: 'Started shift / On Duty'
      });
      console.log(`[DATABASE] Created new tracking session for ${user.name}`);
    }

    res.status(200).json({ message: 'Tracking started', session: existingSession });
  } catch (err) {
    console.error('[DATABASE] Error in startTracking:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = await TrackingSession.find({
      tenant: req.tenantId,
      status: 'active'
    }).populate('user', 'name role');

    // Filter to only include employees
    const employeeSessions = sessions.filter(s => s.user?.role === 'employee');

    res.status(200).json(employeeSessions);
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

    const session = await TrackingSession.findOne({
      user: user._id,
      status: 'active'
    }).sort({ startTime: -1 });

    if (session) {
      session.endTime = new Date();
      session.status = 'completed';
      await session.save();
    }

    // Log activity
    await ActivityLog.create({
      user: user._id,
      tenant: req.tenantId,
      type: 'stop_tracking',
      details: 'Ended shift / Off Duty'
    });

    res.json({ message: 'Tracking stopped', session });
  } catch (error) {
    console.error('Error in stopTracking:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTrackingStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('isTracking tenant role manager name');
    const activeSession = await TrackingSession.findOne({
      user: req.user._id,
      status: 'active'
    });

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
