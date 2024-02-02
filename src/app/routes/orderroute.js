const express = require('express');
const mongoose= require('mongoose');
const router = express.Router();
const ordercontroller = require('../controllers/ordercontroller');
const auth= require('../middlewares/authenticateToken')

//router.post('/', ordercontroller.createOrder);
router.put('/product-update/:id', ordercontroller.UpdateOrderBYProductId);
router.put('/user-update/:id', ordercontroller.UpdateOrderBYUserId)
router.get('/', ordercontroller.getOrdersByProductId);
router.get('/productanduserpopulated', ordercontroller.getOrdersByUserandProductId)
router.get('/:id', ordercontroller.getOrderById);
router.put('/:id',auth, ordercontroller.updateOrderById);
router.delete('/:id',auth,ordercontroller.deleteOrderById);
router.post( '/createorder', auth, ordercontroller.createAOrder);
//router.get('/getorder', auth, ordercontroller.getOrder)

module.exports = router;







