const Coupon = require('../models/Coupon');
const Order = require('../models/order');
const Product = require('../models/Product');
const axios = require('axios');
const UpdateStock = require('../controllers/productController').updatingStock;

exports.createOrder = async (req, res) => {
    console.log('Received request:', req.body);  // לוג לקליטת הבקשה
    
    const { cartItems, promoCode, deliveryMethod } = req.body;

    try {
        // בדיקת קוד קופון
        let discount = 0;
        if (promoCode) {
            const coupon = await Coupon.findOne({ code: promoCode });
            console.log('Coupon found:', coupon);  // לוג לבדיקה אם קוד הקופון נמצא
            
            if (coupon && coupon.expiryDate > new Date()) {
                discount = coupon.discount;
            } else {
                console.log('Invalid or expired coupon');  // לוג אם קוד הקופון לא תקף או שפג תוקפו
                return res.status(400).json({ message: 'Invalid or expired coupon' });
            }
        }

        // חישוב המחיר הכולל על בסיס הנתונים ממונגוDB
        let totalPrice = 0;
        const itemsForPayPal = [];
        for (let item of cartItems) {
            const product = await Product.findById(item._id);
            console.log('Product found:', product);  // לוג אם המוצר נמצא
            
            if (!product) {
                console.log(`Product not found for ID: ${item._id}`);  // לוג אם המוצר לא נמצא
                return res.status(400).json({ message: `Product not found for ID: ${item._id}` });
            }
            const productPrice = product.price * item.quantity;
            totalPrice += productPrice;

            // הוספת פריטים לתשלום דרך PayPal
            itemsForPayPal.push({
                name: product.name,
                unit_amount: {
                    currency_code: 'ILS',
                    value: product.price.toFixed(2),
                },
                quantity: item.quantity
            });
        }

        console.log('Items for PayPal:', itemsForPayPal);  // לוג לבדיקה של הפריטים שמועברים לפייפאל

        // החלת ההנחה אם יש
        const totalpriceitems = totalPrice ; 
        const discountvalue = totalPrice *discount ; 
        totalPrice = totalPrice - (totalPrice * discount);

        // הוספת דמי משלוח אם זה לא איסוף עצמי
        let shippingTotal = 0;
        if (deliveryMethod === 'delivery') {
            shippingTotal = 30; // דמי משלוח
            totalPrice += shippingTotal;
           
        }
       
        console.log('Total value:', totalpriceitems - discountvalue + shippingTotal);

        console.log('Final total price:', totalPrice.toFixed(2));  // לוג למחיר הסופי לפני שליחת הבקשה לפייפאל

        // יצירת הזמנה בפייפאל
        const payPalResponse = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'ILS',
                    value: totalPrice.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'ILS',
                            value:totalpriceitems.toFixed(2)
                        }
                    ,
                    shipping: { 
                        currency_code: 'ILS',
                        value:shippingTotal.toFixed(2)

                    },
                    discount:{
                        currency_code: 'ILS',
                        value:discountvalue.toFixed(2)
                    }
                    }
                },
                items: itemsForPayPal
            }]
        }, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_CLIENT_SECRET
            }
        });

        console.log('PayPal response:', payPalResponse.data.id);  // לוג לתשובה מפייפאל

        // עדכון מלאי המוצרים
        
        const newOrder = new Order({
            id :payPalResponse.data.id ,
            items: cartItems.map((item)=>({productId:item._id , quantity: item.quantity ,size:item.size}))

        })
        await newOrder.save()

        res.status(200).json({ message: 'Order processed successfully', id: payPalResponse.data.id });
    } catch (error) {
      
        console.log(error.response.data); // לוג לשגיאות כלליות
        res.status(500).json({ message: 'Error processing order', error });
    }

};


console.log("Request received for order confirmation...");
exports.confirmOrder = async (req, res) => {
    console.log("Entered confirmOrder function...");
    try {
        const { id } = req.params;

        console.log(`Looking for order with PayPal ID: ${id}`);

        // מציאת ההזמנה במאגר הנתונים לפי ה-PayPal ID
        const orderFound = await Order.findOne({ id });

        if (!orderFound) {
            console.log(`Order with PayPal ID ${id} not found in MongoDB.`);
            res.status(404);
            throw new Error('Order not found in MongoDB');
        }

        console.log('Order found:', orderFound);

        // קריאה לפייפאל לוודא שההזמנה מאושרת
        console.log('Making request to PayPal to verify order status...');

        const payPalResponse = await axios.get(`${process.env.PAYPAL_API}/v2/checkout/orders/${id}`, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_CLIENT_SECRET
            }
        });

        console.log('Received response from PayPal:', payPalResponse.data);

        if (payPalResponse.data.status !== 'APPROVED' && payPalResponse.data.status !== 'COMPLETED') {
            res.status(400);
            throw new Error(`Order status is not approved or completed. Status: ${payPalResponse.data.status}`);
        }

        console.log('Order approved. Proceeding with stock update.');

        // עדכון מלאי המוצרים
        await UpdateStock(res, orderFound.items);

        console.log('Deleting the order from MongoDB.');

        // מחיקת ההזמנה מהמאגר לאחר אישור ותהליך עדכון מלאי
        await Order.findByIdAndDelete(orderFound._id);

        res.status(200).json({ message: 'Order confirmed successfully' });
    } catch (error) {
        console.log('Error confirming order:', error.message);
        console.error('Full error:', error); // לוג נוסף להצגת כל שגיאה שקרתה
        res.status(400).json({ message: 'Order Failed', error: error.message });
    }
};
exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        await Order.findOneAndDelete({ _id: orderId });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
};
