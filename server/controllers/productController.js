const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Add a new product
// Add a new product
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, sizes } = req.body;
    const images = req.files.map(file => file.path);

    console.log('Received sizes:', sizes);

    let parsedSizes;
    try {
        parsedSizes = JSON.parse(sizes);
    } catch (error) {
        return res.status(400).json({ message: 'Invalid sizes format' });
    }

    const product = new Product({
        name,
        description,
        price,
        images,
        sizes: parsedSizes
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});
// Get all products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
}); 

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product removed successfully' });
});

module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
};