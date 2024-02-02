const express = require('express');
const mongoose= require('mongoose');
const router = express.Router();
const productController = require('../controllers/productcontroller');

router.post('/', productController.createProduct);
router.get('/', productController.getallProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProductById);
router.delete('/:id', productController.deleteProductById);

module.exports = router;

