const Restaurant = require('../models/restaurants');

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    //const { name } = req.body;
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'An error occurred while creating the restaurant.' });
  }
};

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'An error occurred while fetching restaurants.' });
  }
};

//Get a Restaurant By ID

exports. getRestaurantById = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: 'orders',populate: [
        { path: 'product_id', model: 'Product', category:'-__v -_id' },
        { path: 'user_id', model: 'User',category:'-__v -_id' },
      ]
    })
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};

//Update Restaurant with more orders

exports.updateRestaurantByOrders = async (req, res) => {
  try {
    const restaurantId = req.params.id
    const restaurant = await Restaurant.findById(restaurantId)
    const newOrderId = [...restaurant.orders,...req.body.orders]
    restaurant.orders= newOrderId
    await restaurant.save();
    const test = await restaurant.populate("orders")
    res.status(201).json(test);
    //res.status(201)
  } catch (error) {
    console.log('error',error);
    res.status(500).json({ error: 'Failed to create an order' });
  }
};


