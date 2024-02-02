const Product = require('../models/products');
const productsPerPage= 10;


// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log('test');
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create an product' });
  }
};



// Get all products
const getallProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const products = await Product.find()
    .skip((page - 1) * productsPerPage)
    .limit(productsPerPage);
    res.json(
      {products,
      currentPage:page,
      totalPages});
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
    console.log("error", error)
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the product' });
    }
  };
  
  // Update a product by ID
  const updateProductById = async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the product'});
    }
  };
  
  // Delete a product by ID
  const deleteProductById = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the product' });
    }
  };

//Total Sales of a Product

// app.js
/*app.get('/total-sales', async (req, res) => {
  try {
    const products = await Product.find().populate('orders'); // Fetch products and populate "orders" field

    const totalSalesByProduct = {};

    products.forEach((product) => {
      product.orders.forEach((order) => {
        const { price, quantity } = order;
        if (!totalSalesByProduct[product.productName]) {
          totalSalesByProduct[product.productName] = 0;
        }
        totalSalesByProduct[product.productName] += price * quantity;
      });
    });

    res.json(totalSalesByProduct);
  } catch (err) {
    console.error('Error calculating total sales:', err);
    res.status(500).json({ error: 'Error calculating total sales' });
  }
});*/






module.exports = {
  createProduct,
  getallProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};