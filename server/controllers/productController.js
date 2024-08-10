const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const mongoose = require('mongoose');


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

// productController.js

const updateStock = async (req, res) => {
    try {
        // בדיקת הנתונים שמתקבלים מה-Client
        console.log('Received request body:', req.body);
        
        const { productId, size, quantity } = req.body.cartItems[0];

        console.log('Received productId:', productId); 
        console.log('Received size:', size); 
        console.log('Received quantity:', quantity); 

        if (!productId) {
            return res.status(404).json({ message: 'Product ID is missing or undefined' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product not found with ID:', productId); 
            return res.status(404).json({ message: 'Product not found' });
        }

        const sizeObject = product.sizes.find(s => s.size === size);

        if (!sizeObject) {
            console.log('Size not found:', size); 
            return res.status(404).json({ message: 'Size not found' });
        }

        console.log('Current stock for size', size, 'is', sizeObject.quantity);
        sizeObject.quantity -= quantity;
        console.log('New stock for size', size, 'is', sizeObject.quantity);

        await product.save();

        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Error updating stock' });
    }
};
module.exports = {
    addProduct,
    getProducts,
    updateStock
};