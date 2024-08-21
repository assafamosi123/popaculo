const express = require('express');
const router = express.Router();
const { addProduct, getProducts,updateStock} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../utils/upload');
router.route('/').post(protect, admin, upload.array('images'), addProduct);
router.route('/').get(getProducts);
router.post('/update-stock',protect, admin ,updateStock);

module.exports = router;