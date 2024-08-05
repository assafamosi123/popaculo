const mongoose = require('mongoose');

const sizeSchema = mongoose.Schema({
    size: { type: String, required: true }, // שם המידה (S, M, L)
    quantity: { type: Number, default: 0 }, // כמות במלאי לאותה מידה
});

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        images: [{ type: String }], // מערך של כתובות תמונות
        sizes: [sizeSchema], // מערך של אובייקטים שמייצגים מידות וכמויות
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;