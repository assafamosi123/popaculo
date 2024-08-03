const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../utils/upload');

router.route('/').post(protect, admin, upload.array('images'), addProduct);
router.route('/').get(getProducts);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;