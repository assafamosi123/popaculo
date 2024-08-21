const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const addressRoutes = require('./routes/addressRoutes');
const emailRoutes = require('./routes/emailRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://www.popaculo.com'],
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));


// Middleware to parse URL-encoded data
app.use('/api', couponRoutes);
app.use('/api', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/', emailRoutes); 
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});         