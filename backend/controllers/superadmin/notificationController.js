const Notification = require('../../models/tenant/Notification');

// @desc    Broadcast a global notification to all tenants
// @route   POST /api/superadmin/notifications/broadcast
// @access  Private/SuperAdmin
exports.broadcastNotification = async (req, res) => {
  const { title, message, type } = req.body;

  try {
    // In a multi-tenant system, a "global" notification might be 
    // a separate collection or we broadcast to all tenants.
    // For now, we'll label it as 'global' which the frontend can filter.
    const notification = await Notification.create({
      title,
      message,
      type,
      recipientRole: 'tenant', // Send to all tenant admins
      isGlobal: true,
      status: 'sent'
    });

    res.status(201).json({
      message: 'Global notification broadcasted',
      notification
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
