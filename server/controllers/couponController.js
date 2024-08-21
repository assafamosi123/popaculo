const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res) => {
    const { code, discount, expiryDate } = req.body;

    try {
        const coupon = new Coupon({
            code,
            discount,
            expiryDate
        });

        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error creating coupon', error });
    }
};

exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupons', error });
    }
};
exports.checkPromoCode = async (req, res) => {
    try {
        const { promoCode } = req.body;
        const coupon = await Coupon.findOne({ code: promoCode });

        if (coupon && coupon.expiryDate > new Date()) {
            return res.json({ valid: true, discount: coupon.discount });
        } else {
            return res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error checking promo code:', error);
        res.status(500).json({ message: 'Error checking promo code' });
    }
};