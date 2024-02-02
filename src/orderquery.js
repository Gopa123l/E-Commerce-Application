const mongoose = require("mongoose");
const fs = require("fs");
const Papa = require("papaparse");
const Order = require('./app/models/orders');
const Product = require('./app/models/products')
const User = require('./app/models/users')


async function queryAndConvertToCSV() {
    try {

        const MONGODB_URI = 'mongodb+srv://f20200278:TRSABCGG@cluster0.xm5tetj.mongodb.net/Node-API?retryWrites=true&w=majority';

        mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch((error) => {
                console.error('Error connecting to MongoDB:', error);
            });


        const orders = await Order.find({}).populate('product_id user_id', 'product_name price name email').lean();


        // Extract user and product details from the orders
        const orderDetails = orders.map((order) => {
            return [
                order._id,
                order.orderNo,
                order.user_id?.length ? order.user_id[0]._id : '--',
                order.user_id?.length ? order.user_id[0].name : '---',
                order.user_id?.length ? order.user_id[0].email : '---',
                order.product_id?.map((product) => `${product._id}: ${product.product_name}`).join(',')||'----',
                order.product_id.reduce((totalPrice, product) => totalPrice + product.price, 0)]
        })

        console.log('orderDetails', orderDetails)

        // Convert JSON data to CSV format using Papa Parse
        const csv = Papa.unparse({
            fields: ['orderid', 'orderNo', 'User ID', 'User Name', 'User email', 'Products', 'Total Price'],
            data: orderDetails,
        });

        // Write the CSV data to a file named 'output.csv'
        fs.writeFileSync("orders.csv", csv);

        console.log("CSV file created successfully!");
    } catch (err) {
        console.error("Error:", err);
    }
}

// Call the function to run the process
queryAndConvertToCSV();
