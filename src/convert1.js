const fs = require('fs');
const Papa = require('papaparse');

// Sample JSON data of the order model with references to users and products
const orderData = [
  {
    "_id": "64cb5305b8eaf54b5bbc79d8",
	"orderNo": "14",
    users: { "_id": "64cb52a1b8eaf54b5bbc79d5",
    "name": "Rishab",
    "email": "rishab134@gmail.com" },
    products: [
      
      { "_id": "64cb5285b8eaf54b5bbc79d2",
      "product_name": "Cakes",
      "price": 50 },
    ],
  },
  {
    "_id": "64ca5d5e64d8b1a28db6b100",
	"orderNo": "12",
    users: { "_id": "64ca2f3599da176b2cc39915",
    "name": "anushka",
    "email": "anushka134@gmail.com" },

    products: [
      {"_id": "64c4b332142e5dca012c2952",
      "product_name": "PIZAS",
      "price": 100 },
      { "_id": "64c7de5da385692807a32bf5",
      "product_name": "Chapati",
      "price": 60 },
    ],
  },
  // Add more order data as needed
];

// Step 1: Convert the JSON data to an array of arrays (rows in the CSV)
const csvRows = orderData.map((order) => {
  return [
    order._id,
    order.orderNo,
    order.users._id,
    order.users.name,
    order.users.email,
    order.products.map((product) => `${product._id}: ${product.product_name}`).join(','),
    order.products.reduce((totalPrice, product) => totalPrice + product.price, 0),
  ];
});

// Step 2: Convert the array of arrays to CSV using Papa Parser
const csvData = Papa.unparse({
  fields: ['orderid', 'orderNo', 'User ID', 'User Name','User email', 'Products', 'Total Price'],
  data: csvRows,
});

// Step 3: Write CSV data into a file
fs.writeFile('orders.csv', csvData, (err) => {
  if (err) {
    console.error('Error writing CSV file:', err);
  } else {
    console.log('CSV file has been generated successfully.');
  }
});
