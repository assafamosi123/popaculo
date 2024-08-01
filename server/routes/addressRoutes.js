// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addAddress, getAddresses, deleteAddress } = require('../controllers/addressController');

router.post('/', protect, addAddress);
router.get('/', protect, getAddresses);
router.delete('/:id', protect, deleteAddress); // נתיב למחיקת כתובת

module.exports = router;