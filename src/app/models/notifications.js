// models/notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  read: { type: Boolean, default: false },
  delete: {type: Boolean, default:false},
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
