/**
 * Utility for sending strictly isolated notifications via Socket.io
 */
const sendNotification = (io, notification) => {
  if (!io || !notification || !notification.recipient) return;

  const userId = typeof notification.recipient === 'object' 
    ? notification.recipient._id 
    : notification.recipient;

  // Real-time delivery to the user's private room only
  io.to(`user:${userId}`).emit('notification:new', notification);
};

const emitToUser = (io, userId, event, data) => {
  if (!io || !userId || !event) return;
  io.to(`user:${userId.toString()}`).emit(event, data);
};

module.exports = { sendNotification, emitToUser };
