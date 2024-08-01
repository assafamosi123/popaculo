import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CheckoutStyles.css';

const CheckoutPage = () => {
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
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
                const token = localStorage.getItem('token'); // נניח שהטוקן מאוחסן ב-localStorage
                const { data } = await axios.get(`${process.env.REACT_APP_SERVER}/api/address`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
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
        setNewAddress({
            ...newAddress,
            [name]: value
        });
    };

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    const handleAddressDelete = async (addressId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER}/api/address/${addressId}`);
            setAddresses(addresses.filter(address => address._id !== addressId));
            if (selectedAddress && selectedAddress._id === addressId) {
                setSelectedAddress(null);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleAddAddress = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER}/api/address`, newAddress);
            setAddresses([...addresses, data.address]);
            setSelectedAddress(data.address);
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            try {
                const addressToUse = selectedAddress ? selectedAddress : newAddress;
                await axios.post(`${process.env.REACT_APP_SERVER}/api/order`, {
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
                                    <p>לא נמצאו כתובות. אנא הוסף כתובת חדשה.</p>
                                )}
                                <div>
                                    <h6>הוסף כתובת חדשה</h6>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="שם פרטי"
                                        value={newAddress.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="שם משפחה"
                                        value={newAddress.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="street"
                                        placeholder="רחוב"
                                        value={newAddress.street}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="streetNumber"
                                        placeholder="מספר"
                                        value={newAddress.streetNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="עיר"
                                        value={newAddress.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="מיקוד"
                                        value={newAddress.postalCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button type="button" onClick={handleAddAddress}>הוסף כתובת</button>
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="section">
                                <h6>פרטי קשר</h6>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="טלפון"
                                    value={newAddress.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="אימייל"
                                    value={newAddress.email}
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