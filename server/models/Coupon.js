const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageCount: {
        type: Number,
        default: 0
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;