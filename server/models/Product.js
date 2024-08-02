const mongoose = require('mongoose');

const sizeSchema = mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, required: true },
});

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    sizes: [sizeSchema],
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;