const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

exports.sendOrderEmail = (req, res) => {
    const { address, cartItems, deliveryMethod } = req.body;

    if (!address || !cartItems || !deliveryMethod) {
        return res.status(400).json({ message: 'Missing address, cartItems, or deliveryMethod' });
    }

    const orderSummary = `
        <h3>Order Details</h3>
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
                    <p>${item.name} - ${item.size} - ${item.quantity} units - ${item.price} $ per unit</p>
                </li>
            `).join('')}
        </ul>
        <p>Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} $</p>
    `;

    const subjectText = `New Order - ${deliveryMethod === 'pickup' ? 'Self-Pickup' : 'Delivery'}`;

    const data = {
        from: 'popaculoooo@gmail.com',
        to: 'popaculoooo@gmail.com',
        subject: subjectText,
        html: orderSummary,
    };

    mg.messages().send(data, function (error, body) {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        }
        console.log(body);
        return res.status(200).send('Email sent successfully');
    });
};