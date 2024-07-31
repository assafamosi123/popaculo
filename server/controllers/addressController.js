// controllers/addressController.js
const Address = require('../models/Address');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const addAddress = async (req, res) => {
    const { street, city, zipCode, phone, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const newAddress = new Address({
        user: user._id,
        street,
        city,
        zipCode,
        phone,
        email
    });

    await newAddress.save();

    user.addresses.push(newAddress._id);
    await user.save();

    res.status(201).json({
        address: newAddress
    });
    
};

module.exports = { addAddress };