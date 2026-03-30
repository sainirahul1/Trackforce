const Notification = require('../../models/tenant/Notification');
const { emitToUser } = require('../../utils/notificationUtils');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('getNotifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Real-time state synchronization
    const io = req.app.get('io');
    emitToUser(io, req.user._id, 'notification:read', req.params.id);

    res.json(notification);
  } catch (error) {
    console.error('markAsRead error:', error);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

// @desc    Mark all notifications as read for logged-in user
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    // Real-time state synchronization
    const io = req.app.get('io');
    emitToUser(io, req.user._id, 'notification:read_all', true);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
};

// @desc    Delete a single notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Real-time state synchronization
    const io = req.app.get('io');
    emitToUser(io, req.user._id, 'notification:deleted', req.params.id);

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('deleteNotification error:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
