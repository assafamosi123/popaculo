const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addAddress } = require('../controllers/addressController');

router.post('/', protect, addAddress);

module.exports = router;