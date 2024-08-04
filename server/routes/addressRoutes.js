const express = require('express');
const { addAddress, getAddresses, deleteAddress } = require('../controllers/addressController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getAddresses).post(protect, addAddress);
router.route('/:id').delete(protect, deleteAddress);

module.exports = router;