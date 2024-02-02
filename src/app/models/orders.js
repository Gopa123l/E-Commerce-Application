const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema(
    {
        orderNo: { type: String, required: true },

        product_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],

        user_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],

        restaurant_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant'
        }],

        totalAmount:Number
  
    },
    {
        timestamps: true
    }
)


const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;