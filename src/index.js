const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socketIO= require('socket.io');
const cors= require('cors');
const http= require('http')
const userRoutes = require('./app/routes/userroute');
const productRoutes = require('./app/routes/productroute');
const orderRoutes= require('./app/routes/orderroute');
const restaurantRoutes= require('./app/routes/restaurantroute')
const notificationscontroller= require('./app/controllers/notificationcontroller')
const Restaurant= require('./app/models/restaurants');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io =socketIO(server,{cors: {origin: "*"}});// Initialize Socket.IO with the server
 
const PORT = 5004;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("abcd", MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/restaurants', restaurantRoutes );


//Create namespace for each restaurant by fetching all the restaurants
async function createRestaurantNamespaces() {
  const restaurants = await Restaurant.find();

  restaurants.forEach(restaurant => {
    const restaurantNamespace = io.of(`/${restaurant._id}`);

    restaurantNamespace.on('connection', socket => {
      console.log(`Socket connected to ${restaurant._id}: ${socket.id}`);

      socket.on('markAsRead', async (notificationIds) => {
        try {
          // Update notification status as "read" in your database using the provided IDs
          // Emit a "notificationsUpdated" event to notify other clients about the change
          await notificationscontroller.markNotificationsAsRead(notificationIds);
          restaurantNamespace.emit('notificationsUpdated', notificationIds);
          console.log("notifications read", notificationIds)
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      });

       socket.on('markAsCleared', async (notificationIds) => {
      try {
        // Update notification status as "deleted" in your database using the provided IDs
        // Emit a "notificationsCleared" event to notify other clients about the change
        await notificationscontroller.markNotificationsAsCleared(notificationIds);
        restaurantNamespace.emit('notificationsCleared', notificationIds);
        console.log("notifications cleared", notificationIds)
    } catch (error) {
        console.error('Error marking notifications as cleared:', error);
    }
  });

      socket.on('disconnect', () => {
      console.log(`Socket disconnected from ${restaurant._id}: ${socket.id}`);
      });

    });
  });
  }

// Pass the io object to the order controller
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/orders', orderRoutes);
app.use('/api/notifications/unread', notificationscontroller.getUnreadNotifications);
//app.use('/api/notifications', notificationRoutes)



app.use((req,res,next) => { 
  console.log("HTTP Method-" + req.method+ ",URL-"+ req.url)
  next();
})

createRestaurantNamespaces().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
});


module.exports=app;







