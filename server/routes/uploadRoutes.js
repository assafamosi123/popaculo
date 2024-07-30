// uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadProduct } = require('../controllers/uploadController');
const upload = require('../utils/upload');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.array('images'), uploadProduct);

module.exports = router;