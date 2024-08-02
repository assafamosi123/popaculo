const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProduct, updateProductStock } = require('../controllers/productController');

router.route('/')
    .get(getProducts)
    .post(addProduct);

router.route('/:id')
    .delete(deleteProduct);

router.route('/update-stock')
    .put(updateProductStock);

module.exports = router;