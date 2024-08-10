const mailgun = require('mailgun-js');
const { v4: uuidv4 } = require('uuid'); // ודא שהתקנת את uuid
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

exports.sendOrderEmail = (req, res) => {
    const { address, cartItems, deliveryMethod ,orderNumber} = req.body;

    console.log('Received order data:', { address, cartItems, deliveryMethod });

    if (!address || !cartItems || !deliveryMethod) {
        console.log('Missing data:', { address, cartItems, deliveryMethod });
        return res.status(400).json({ message: 'Missing address, cartItems, or deliveryMethod' });
    }

   

    const orderSummary = `
        <h3>Order Details</h3>
        <p>Order ID: ${orderNumber}</p> <!-- הוספת מספר הזמנה -->
        <p>Delivery Method: ${deliveryMethod === 'pickup' ? 'Self-Pickup' : 'Delivery'}</p>
        <p>Name: ${address.firstName} ${address.lastName}</p>
        <p>Address: ${deliveryMethod === 'delivery' ? `${address.street} ${address.streetNumber}, ${address.city}` : 'N/A'}</p>
        <p>Postal Code: ${address.postalCode || 'N/A'}</p>
        <p>Phone: ${address.phone}</p>
        <p>Email: ${address.email}</p>
        <h4>Ordered Products:</h4>
        <ul>
            ${cartItems.map(item => `
                <li>
                    <p>${item.name} - ${item.size} - ${item.quantity} units - ${item.price} ₪ per unit</p>
                </li>
            `).join('')}
        </ul>
        <p>Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)} ₪</p>
    `;

    const subjectText = `New Order - ${deliveryMethod === 'pickup' ? 'Self-Pickup' : 'Delivery'}`;

    const data = {
        from: 'popaculoooo@gmail.com',
        to: 'popaculoooo@gmail.com', // שליחת המייל ללקוח
        subject: subjectText,
        html: orderSummary,
    };

    console.log('Sending email with the following data:', data);

    mg.messages().send(data, function (error, body) {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent successfully:', body);
        return res.status(200).json({ message: 'Email sent successfully', orderNumber });
    });
};