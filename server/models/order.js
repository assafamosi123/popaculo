const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        productId:{
            type:String 

        }
        ,
        quantity: {
            type : Number
        },
        size:{
            type : String 
        }

    }]

    
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;