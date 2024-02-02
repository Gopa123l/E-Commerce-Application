const Notification = require('../models/notifications');

// Mark notifications as read
const markNotificationsAsRead = async (notificationIds) => {
  try {
    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { read: true } }
    );
  } catch (error) {
    throw new Error('Failed to mark notifications as read');
  }
};

// Mark notifications as cleared/delete
const markNotificationsAsCleared = async (notificationIds) => {
  try {
    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { delete: true } }
    );
  } catch (error) {
    throw new Error('Failed to mark notifications as cleared');
  }
};

// notificationsController.js
const getUnreadNotifications = async (req, res) => {
  try {
    const unreadNotifications = await Notification.find({ read: false, delete: false })
      .populate({
        path: 'order',
        populate: [
          { path: 'product_id', model: 'Product', category:'-__v -_id' },
          { path: 'user_id', model: 'User',category:'-__v -_id' },
        ]
      })
      .exec();
    res.json(unreadNotifications);
    //console.log("unread", unreadNotifications)
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


module.exports = {
  markNotificationsAsRead,
  markNotificationsAsCleared,
  getUnreadNotifications
};

