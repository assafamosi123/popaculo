const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { checkPromoCode } = require('../controllers/couponController'); // ייבוא של הפונקציה


router.post('/coupons', couponController.createCoupon);
router.get('/coupons', couponController.getCoupons);
router.post('/check-promo-code', checkPromoCode);
module.exports = router;