const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send-order-email', emailController.sendOrderEmail);

module.exports = router;