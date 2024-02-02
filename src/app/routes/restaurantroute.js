const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantcontroller');

// Create a new restaurant
router.post('/', restaurantController.createRestaurant);

// Get all restaurants
router.get('/', restaurantController.getAllRestaurants);
//Get restaurant By ID
router.get('/:id', restaurantController.getRestaurantById)
//Update restaurant with more orders
router.put('/:id', restaurantController.updateRestaurantByOrders)

module.exports = router;
