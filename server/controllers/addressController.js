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

    // שליחת מייל עם פרטי ההזמנה
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.BUSINESS_EMAIL,
        subject: 'New Order',
        text: `Order details:\n\nAddress: ${street}, ${city}, ${zipCode}\nPhone: ${phone}\nEmail: ${email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.status(201).json(newAddress);
};

module.exports = { addAddress };