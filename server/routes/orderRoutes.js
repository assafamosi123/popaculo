const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/create-order', orderController.createOrder);
router.get('/confirmOrder/:id',orderController.confirmOrder);
router.delete('/deleteOrder/:id', orderController.deleteOrder);




module.exports = router;