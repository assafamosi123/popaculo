const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const mongoose = require('mongoose');


// Add a new product
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, sizes } = req.body;
    const images = req.files.map(file => file.path);

    

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
async function updateStock(req, res) {
    const { cartItems } = req.body;
   await updatingStock(res ,cartItems); 
    res.status(200).json({ message: 'Stock updated successfully' });
}
const  updatingStock = async(res,cartItems)=>{
    try {
       

        for (const item of cartItems) {
            const {   productId, size, quantity } = item;

            console.log('Received productId:', productId);
            console.log('Received size:', size);
            console.log('Received quantity:', quantity);

            const product = await Product.findById(productId);
            if (!product) {
                console.error(`Product not found with ID: ${productId}`);
                return res.status(404).json({ message: 'Product not found' });
            }

            const sizeObject = product.sizes.find(s => s.size === size);
            if (!sizeObject) {
                console.error(`Size ${size} not found in product ${productId}`);
                return res.status(404).json({ message: 'Size not found' });
            }

            console.log(`Current stock for size ${size} is ${sizeObject.quantity}`);
            const newStock = sizeObject.quantity - quantity;
            console.log(`New stock for size ${size} is ${newStock}`);

            if (newStock < 0) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }

            // Update the size's quantity directly without affecting other fields
            await Product.findByIdAndUpdate(
                productId,
                { $set: { "sizes.$[elem].quantity": newStock } },
                {
                    arrayFilters: [{ "elem.size": size }],
                    new: true,
                    runValidators: false // Avoid revalidation of the entire document
                }
            );
        }

       
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Error updating stock' });
    }
}

module.exports = {
    addProduct,
    getProducts,
    updateStock,
    updatingStock
};