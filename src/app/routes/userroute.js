const express = require('express');
const mongoose= require('mongoose');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');

router.post('/', usercontroller.createUser);
router.put('/order-update/:id', usercontroller.UpdateUserBYOrderId);
router.get('/', usercontroller.getAllUsers);
router.get('/:id', usercontroller.getUserById);
router.put('/:id', usercontroller.updateUserById);
router.delete('/:id', usercontroller.deleteUserById);
router.post('/signup', usercontroller.signup);
router.post('/signin', usercontroller.signin);

module.exports = router;



