const Notification = require('../../models/tenant/Notification');
const User = require('../../models/tenant/User');
const { sendNotification } = require('../../utils/notificationUtils');

// @desc    Broadcast a notification by creating individual records for each target user
// @route   POST /api/superadmin/notifications/broadcast
// @access  Private/SuperAdmin
exports.broadcastNotification = async (req, res) => {
  const { title, message, type, tenantId, role, priority } = req.body;

  try {
    // 1. Build the query to find target users
    const query = {};
    if (tenantId) query.tenant = tenantId;
    if (role && role !== 'all') query.role = role;

    const targetUsers = await User.find(query).select('_id');

    if (targetUsers.length === 0) {
      return res.status(404).json({ message: 'No users found matching the criteria' });
    }

    // 2. Prepare individual notification records for every user
    const notificationData = targetUsers.map(user => ({
      recipient: user._id,
      title,
      desc: message,
      type: type || 'broadcasting',
      tenant: tenantId || null,
      role: role || 'all',
      isGlobal: !tenantId,
      priority: priority || 'medium'
    }));

    // 3. Batch create records to ensure isolation
    const createdNotifications = await Notification.insertMany(notificationData);

    // 4. Emit to each user directly via their private socket room
    const io = req.app.get('io');
    if (io) {
      createdNotifications.forEach(notif => {
        sendNotification(io, notif);
      });
    }

    res.status(201).json({
      message: `Notification delivered individually to ${createdNotifications.length} users`,
      count: createdNotifications.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get broadcast history
// @route   GET /api/superadmin/notifications
// @access  Private/SuperAdmin
exports.getBroadcastHistory = async (req, res) => {
  try {
    const history = await Notification.find({ isGlobal: true }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
