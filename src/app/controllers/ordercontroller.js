const { default: mongoose } = require('mongoose');
const Order = require('../models/orders');
const Notification = require('../models/notifications');
const Product= require('../models/products');
const User= require('../models/users');
const Restaurant= require('../models/restaurants');
const ordersPerPage =3;
// Create a new order in the database without middleware
const createOrder = async (req, res) => {
    try {
      console.log('test');
      if(!req.body.product_id){
        return res.status(500).json({error:"product id is required !!"})
      }
      const order = await Order.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create an order' });
    }
  };

//Create a order;
const createAOrder = async (req, res) =>{

  try {
      const {orderNo, product_id, restaurant_id} = req.body;
      const user_id = req.userId;
      const order = await Order.create({ orderNo, product_id,restaurant_id, user_id });     
      const product = await Product.findById(product_id);
      const user = await User.findById(user_id);
      const restaurant= await Restaurant.findById(restaurant_id);
      // Create a notification for the new order
      const notification = await Notification.create({ order: order._id });
      // Emit event to notify the restaurant
      const orderData = { orderNo, 
        product:product.toJSON(),
        user:user.toJSON(),
       restaurant:restaurant.toJSON() 
      };

      /*req.io.emit('newOrders', {orderData, notification});
      console.log("Emitted new order:", {orderData,notification});
      res.status(201).json(order);*/
      // we have to insert the socketio in both the frontend and backend of our contract task serrvice
      //first need to unseerdtand the entire frontend and backend code of the contract the service
      /*req.io.of(`/${restaurant_id}`).emit('newOrders', {orderData, notification});
      console.log("Emitted new order:",{orderData, notification});
      res.status(201).json(order);*/
      const restaurantNamespace = req.io.of(`/${restaurant_id}`);
      restaurantNamespace.emit('newOrders', {orderData, notification});
      console.log("Emitted new order:", {orderData,notification});
      res.status(201).json(order);



  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Something went wrong"});
  }
  
}

//Get A Order

/*const getOrder = async (req, res) =>{
  try {
      
      const orders = await Order.find({user_id : req.userId});
      res.status(200).json(orders);
      console.log(req.userId);

  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Something went wrong"});
  }
}*/

// Get all orders with product_id populated
const getOrdersByProductId = async (req, res) => {
  
const page = parseInt(req.query.page) || 1;

    try {
    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    const orders = await Order.find().populate('product_id', 'product_name price quantity')
    .skip((page - 1) * ordersPerPage)
    .limit(ordersPerPage);
    res.json(
      {orders,
      currentPage:page,
      totalPages});
    } 
    catch (error) {
      res.status(500).json({ error: 'Failed to retrieve order' });
    }
  };

//Get all the orders with user_id prodct_id populated

const getOrdersByUserandProductId = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
      try {
      const totalOrders = await Order.countDocuments();
      const totalPages = Math.ceil(totalOrders / ordersPerPage);
      const orders = await Order.find().populate('user_id product_id restaurant_id', 'product_name price name email restaurant_name ')
      .skip((page - 1) * ordersPerPage)
      .limit(ordersPerPage);
      console.log("orders", orders)
     // req.io.emit('newOrders', orders);
     
      res.json(
        {orders,
        currentPage:page,
        totalPages});
      } 
      catch (error) {
        console.log("error", error)
        res.status(500).json({ error: 'Failed to retrieve order' });
      
      }
    };


// Get order by ID
const getOrderById = async (req, res) => {
    
  try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the order' });
    }
};

 // Update a order by ID
 const updateOrderById = async (req, res) => {

  const id = req.params.id;
  const {orderNo, product_id} = req.body;

  const newOrder = {
    orderNo : orderNo,
    product_id: product_id,
    user_id : req.userId
}

try {
await Order.findByIdAndUpdate(id, newOrder, {new : true});
res.status(200).json(newOrder);

} catch (error) {
console.log(error);
res.status(500).json({message: "Something went wrong"});
} 
 } 

// Update order by Product ID
const UpdateOrderBYProductId = async (req, res) => {
    try {
      const orderId = req.params.id
      console.log('REQ BODY',req.body);
      const order = await Order.findById(orderId)

      const newProductId = [...order.product_id,...req.body.product_id]
      order.product_id= newProductId
      await order.save();

      const test = await order.populate("product_id",'price')
      let prices = 0
      test.product_id.forEach(el => {
        prices += el.price
      })
      order.totalAmount = prices
      order.save()

      console.log("test",prices);
      res.status(201).json(test);
      // res.status(201)
    } catch (error) {
      console.log('error',error);
      res.status(500).json({ error: 'Failed to create an product' });
    }
  };

//

//Update Order By User Id
const UpdateOrderBYUserId = async (req, res) => {
  try {
    const orderId = req.params.id
    const order = await Order.findById(orderId)

    const newUserId = [...order.user_id,...req.body.user_id]
    order.user_id= newUserId
    await order.save();

    const test = await order.populate("user_id")
    res.status(201).json(test);
    // res.status(201)
  } catch (error) {
    console.log('error',error);
    res.status(500).json({ error: 'Failed to create an user' });
  }
};


// Delete a order by ID
const deleteOrderById = async (req, res) => {
  const id = req.params.id;
  try {
      
      const order = await Order.findByIdAndRemove(id);
      res.status(202).json(order);

  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Something went wrong"});
  }
}
    /*try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the order' });
    }
  };*/

//Product with maximum no sales
/*async function findProductWithMaximumSales () {
  try{
    const orders = await Order.find({}).populate('product_id', 'product_name price quantity');
    const productSalesMap = new Map();

    // Calculate total sales for each product and store it in the map
    orders.forEach((order) => {
      order.product_id.forEach((Product) => {
        const { _id, quantity } = Product;
        if (productSalesMap.has(_id)) {
          productSalesMap.set(_id, productSalesMap.get(_id) + quantity);
        } else {
          productSalesMap.set(_id, quantity);
        }
      });
    });


  //Find the product with maximum sales
    let maxSales = 0;
    let maxSalesProductId;
    productSalesMap.forEach((sales, productId) => {
      if (sales > maxSales) {
        maxSales = sales;
        maxSalesProductId = productId;
      }
    });

    // Retrieve the product details with the maximum sales using the maxSalesProductId
    const productWithMaxSales = await Product.findById(maxSalesProductId);

    //Return the Product with the maximum sales
    return productWithMaxSales;
  } catch (error) {
    console.error('Error finding product with maximum sales:', error);
    throw error;
  }
}

findProductWithMaximumSales()
  .then((productWithMaxSales) => {
    console.log('Product with maximum sales:', productWithMaxSales);
  })
  .catch((error) => {
    console.error('Error:', error);
  });*/

//Total sales of a product

/*const totalSalesOfProduct = async (req, res) => {
  try{
    const orders = await Order.find({}).populate('product_id', 'product_name price quantity');
    const totalSalesByProduct = {};

    orders.forEach((order) => {
      order.product_id.forEach((Product) => {
        const { productName, price, quantity } = Product;
        if (!totalSalesByProduct[productName]) {
          totalSalesByProduct[productName] = 0;
        }
        totalSalesByProduct[productName] += price * quantity;
      });
    });
    res.status(201).json(totalSalesByProduct);
  }

  catch (err) {
    console.error('Error calculating total sales:', err);
    res.status(500).json({ error: 'Error calculating total sales' });
  }
}*/

     
  
  module.exports = {
    createOrder,
    getOrdersByProductId,
    getOrdersByUserandProductId,
    getOrderById,
    updateOrderById,
    UpdateOrderBYProductId,
    UpdateOrderBYUserId,
    deleteOrderById,
    createAOrder,
  };

