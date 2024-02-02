const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
    {
        
        product_name: {
            type: String,
            required: [true, "Please enter a product name"]
        },
        

        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        }

    },
    {
        timestamps: true
    }
)


const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;



