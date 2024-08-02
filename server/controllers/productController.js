const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Update product stock
const updateProductStock = asyncHandler(async (req, res) => {
    const { productId, size } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const sizeToUpdate = product.sizes.find((s) => s.size === size);
    if (sizeToUpdate) {
        if (sizeToUpdate.stock > 0) {
            sizeToUpdate.stock -= 1;
            await product.save();
            res.status(200).json({ message: 'Stock updated successfully', product });
        } else {
            res.status(400);
            throw new Error('Out of stock');
        }
    } else {
        res.status(404);
        throw new Error('Size not found');
    }
});

module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProductStock,
};