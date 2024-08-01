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

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch addresses', error });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this address' });
        }

        await address.remove();

        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(addr => addr.toString() !== req.params.id);
        await user.save();

        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete address', error });
    }
};

module.exports = { addAddress, getAddresses, deleteAddress };