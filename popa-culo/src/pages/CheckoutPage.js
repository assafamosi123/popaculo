import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './CheckoutStyles.css';

const CheckoutPage = () => {
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
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
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const [cartItems, setCartItems] = useState(location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems')) || []);
    const validPromoCode = 'popaculo15';

    useEffect(() => {
        if (!location.state?.cartItems) {
            const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItems(storedCartItems);
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({
            ...newAddress,
            [name]: value
        });
    };

    const handlePromoCodeApply = () => {
        if (promoCode === validPromoCode) {
            setDiscount(0.15);
            alert('קוד הנחה הוחל בהצלחה!');
        } else {
            setDiscount(0);
            alert('קוד הנחה לא חוקי');
        }
    };

    const handleAddAddress = () => {
        localStorage.setItem('userAddress', JSON.stringify(newAddress));
        alert('כתובת נשמרה בהצלחה');
        setCurrentStep(2);
    };

    const handleOrderSubmit = () => {
        const storedAddress = JSON.parse(localStorage.getItem('userAddress'));
        if (!storedAddress) {
            alert('אנא הוסף כתובת לפני ביצוע ההזמנה');
            return;
        }

        // שליחת פרטי ההזמנה לשרת כדי לשלוח מייל
        axios.post(`${process.env.REACT_APP_SERVER}/api/send-order-email`, {
          address: storedAddress,
          cartItems
      })
        .then(response => {
            alert('ההזמנה בוצעה בהצלחה! מייל נשלח.');
            // ניקוי העגלה והכתובת לאחר השליחה
            localStorage.removeItem('cartItems');
            localStorage.removeItem('userAddress');
        })
        .catch(error => {
            console.error('Error sending order email:', error);
            alert('שגיאה בשליחת ההזמנה');
        });
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountedPrice = (totalPrice - (totalPrice * discount)).toFixed(2);

    return (
        <div className="checkout-page">
            <header className="checkout-header">
                <h1>צ'קאאוט</h1>
            </header>
            <div className="step-indicators">
                {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                        <div className={`step ${currentStep >= step ? 'completed' : ''}`}>{step}</div>
                        {step < 3 && <div className="step-line"></div>}
                    </React.Fragment>
                ))}
            </div>
            <div className="checkout-content">
                <div className="left-column">
                    <form>
                        {currentStep === 1 && (
                            <div className="section">
                                <h6>כתובת למשלוח</h6>
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
                                <button type="button" onClick={handleAddAddress}>שמור כתובת</button>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="section">
                                <h6>פרטי המשלוח</h6>
                                <p>כתובת: {newAddress.street}, {newAddress.streetNumber}, {newAddress.city}</p>
                                <p>אימייל: {newAddress.email}</p>
                                <p>טלפון: {newAddress.phone}</p>
                                <button type="button" onClick={() => setCurrentStep(3)}>המשך</button>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="section">
                                <h6>סקירת הזמנה</h6>
                                <ul className="cart-items">
                                    {cartItems.map((item) => (
                                        <li key={item.id}>
                                            <img src={item.images[0]} alt={item.name} />
                                            <div className="product-details">
                                                <span>{item.name}</span>
                                                <span>{item.size}</span>
                                                <span>{item.price} ש"ח</span>
                                                <span>כמות: {item.quantity}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="promo-code">
                                    <input
                                        type="text"
                                        placeholder="הכנס קוד קופון"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button type="button" onClick={handlePromoCodeApply}>החל</button>
                                </div>
                                <div className="total-price">
                                    <span>סה"כ:</span>
                                    <span>{discountedPrice} ש"ח</span>
                                </div>
                                <button type="button" onClick={handleOrderSubmit}>בצע הזמנה</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;