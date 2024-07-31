import React, { useState, useEffect } from 'react';
import './CheckoutStyles.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        streetNumber: '',
        postalCode: '',
        phone: '',
        email: ''
    });

    const cartItems = location.state?.cartItems || [];

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const { data } = await axios.get('http://172.20.10.2:5001/api/address');
                setAddresses(data);
                if (data.length > 0) {
                    setSelectedAddress(data[0]);
                }

            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };
        fetchAddresses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            street: address.street,
            city: address.city,
            streetNumber: address.streetNumber,
            postalCode: address.postalCode,
            phone: address.phone,
            email: address.email
        });
    };

    const handleAddressDelete = async (addressId) => {
        try {
            await axios.delete(`http://172.20.10.2:5001/api/address/${addressId}`);
            setAddresses(addresses.filter(address => address._id !== addressId));
            if (selectedAddress && selectedAddress._id === addressId) {
                setSelectedAddress(null);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            try {
                const addressToUse = selectedAddress ? selectedAddress : formData;
                await axios.post('http://172.20.10.2:5001/api/address', addressToUse);
                // Send order details email
                await axios.post('http://172.20.10.2:5001/api/order', {
                    ...addressToUse,
                    cartItems
                });
                alert('ההזמנה בוצעה בהצלחה!');
            } catch (error) {
                console.error('Error placing order:', error);
            }
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return <div className="checkout-page"><h2>אין מוצרים בעגלה</h2></div>;
    }

    return (
        <div className="checkout-page">
            <header className="checkout-header">
                <h1>צ'קאאוט</h1>
            </header>
            <div className="step-indicators">
                <div className={`step ${currentStep >= 1 ? 'completed' : ''}`}>1</div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 2 ? 'completed' : ''}`}>2</div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 3 ? 'completed' : ''}`}>3</div>
                <div className="step-line"></div>
                <div className={`step ${currentStep >= 4 ? 'completed' : ''}`}>4</div>
            </div>
            <div className="checkout-content">
                <div className="left-column">
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className="section">
                                <h6>כתובת למשלוח</h6>
                                {addresses.length > 0 ? (
                                    <>
                                        <select onChange={(e) => handleAddressSelect(addresses.find(addr => addr._id === e.target.value))}>
                                            {addresses.map(address => (
                                                <option key={address._id} value={address._id}>
                                                    {address.street} {address.streetNumber}, {address.city}
                                                </option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={() => handleAddressDelete(selectedAddress._id)}>מחק כתובת</button>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="שם פרטי"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="שם משפחה"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="street"
                                            placeholder="רחוב"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="streetNumber"
                                            placeholder="מספר"
                                            value={formData.streetNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="עיר"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="postalCode"
                                            placeholder="מיקוד"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </>
                                )}
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="section">
                                <h6>פרטי קשר</h6>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="טלפון"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="אימייל"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="section">
                                <h6>אמצעי תשלום</h6>
                                <div>
                                    <label>
                                        <input type="radio" name="paymentMethod" value="creditCard" required />
                                        כרטיס אשראי
                                    </label>
                                    <label>
                                        <input type="radio" name="paymentMethod" value="paypal" required />
                                        PayPal
                                    </label>
                                </div>
                            </div>
                        )}
                        {currentStep === 4 && (
                            <div className="section">
                                <h6>סקירת הזמנה</h6>
                                <ul className="product-list">
                                    {cartItems.map((item) => (
                                        <li key={item.id}>
                                            <img src={item.images[0]} alt={item.name} />
                                            <div className="product-details">
                                                <span>{item.name}</span>
                                                <span>{item.price} ש"ח</span>
                                                <span>כמות: {item.quantity}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="total-price">
                                    <span>סה"כ:</span>
                                    <span>{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} ש"ח</span>
                                </div>
                            </div>
                        )}
                        <button type="submit" className="checkout-button" disabled={currentStep > 4}>
                            {currentStep < 4 ? 'המשך' : 'בצע הזמנה'}
                        </button>
                    </form>
                </div>
                <div className="right-column">
                    <h6>סיכום הזמנה</h6>
                    <ul className="product-list summary-list">
                        {cartItems.map((item) => (
                            <li key={item.id}>
                                <img src={item.images[0]} alt={item.name} />
                                <div className="product-details">
                                    <span>{item.name}</span>
                                    <span>{item.price} ש"ח</span>
                                    <span>כמות: {item.quantity}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="total-price summary-total">
                        <span>סה"כ:</span>
                        <span>{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} ש"ח</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;