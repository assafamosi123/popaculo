// models/Address.js
const mongoose = require('mongoose');

const addressSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        street: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;