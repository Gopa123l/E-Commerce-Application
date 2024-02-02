const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurant_name: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }],
},

 
{
  timestamps:true
}
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;


