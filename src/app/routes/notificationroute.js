const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationcontroller');

// Mark notifications as read
router.post('/markAsRead', async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await notificationController.markNotificationsAsRead(notificationIds);
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
});

// Mark notifications as cleared
router.delete('/markAsCleared', async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await notificationController.markNotificationsAsCleared(notificationIds);
    res.json({ message: 'Notifications marked as cleared' });
  } catch (error) {
    console.error('Error marking notifications as cleared:', error);
    res.status(500).json({ message: 'Failed to mark notifications as cleared' });
  }
});

module.exports = router;

