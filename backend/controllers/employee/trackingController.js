const User = require('../../models/tenant/User');
const TrackingSession = require('../../models/employee/TrackingSession');
const ActivityLog = require('../../models/employee/ActivityLog');

// Start tracking (On Duty)
exports.startTracking = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isTracking) {
      return res.status(400).json({ message: 'Tracking is already active' });
    }

    user.isTracking = true;
    await user.save();

    const session = new TrackingSession({
      user: user._id,
      tenant: req.tenantId,
      startTime: new Date(),
      status: 'active'
    });
    await session.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      tenant: req.tenantId,
      type: 'shift_start',
      details: 'Started shift / On Duty'
    });

    res.json({ message: 'Tracking started', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      type: 'shift_end',
      details: 'Ended shift / Off Duty'
    });

    res.json({ message: 'Tracking stopped', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
