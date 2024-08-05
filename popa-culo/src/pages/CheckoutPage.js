import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Modal, Box } from '@mui/material';
import './CheckoutStyles.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CheckoutPage = () => {
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // Default to 'delivery'
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
    const [isTermsChecked, setIsTermsChecked] = useState(false); // Track if terms are accepted
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for terms

    const [cartItems, setCartItems] = useState(location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems')) || []);
    const validPromoCode = 'popaculo10';
    const deliveryFee = 30; // Delivery fee of 30 NIS

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
            setDiscount(0.10);
            alert('קוד הנחה הוחל בהצלחה!');
        } else {
            setDiscount(0);
            alert('קוד הנחה לא חוקי');
        }
    };

    const handleAddAddress = () => {
        localStorage.setItem('userAddress', JSON.stringify(newAddress));
        alert('פרטים נשמרו בהצלחה');
        setCurrentStep(2);
    };

    const handleOrderSubmit = (paymentData) => {
    const storedAddress = JSON.parse(localStorage.getItem('userAddress'));
    axios.post(`${process.env.REACT_APP_SERVER}/api/send-order-email`, {
        address: storedAddress,
        cartItems,
        deliveryMethod, // Include delivery method in the payload
        paymentData // Include payment data from PayPal
    })
    .then(response => {
        alert('ההזמנה בוצעה בהצלחה! מייל נשלח.');
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
    const finalPrice = (parseFloat(discountedPrice) + (deliveryMethod === 'delivery' ? deliveryFee : 0)).toFixed(2);

    return (
      <div className="checkout-page" style={{direction:'rtl'}}>
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
          <div className="checkout-content" >
              {currentStep === 1 && (
                  <div className="section" >
                      <h6>שיטת משלוח</h6>
                      <FormControl fullWidth >
                          <InputLabel id="delivery-method-label">בחר שיטת משלוח</InputLabel>
                          <Select
                              labelId="delivery-method-label"
                              id="delivery-method"
                              value={deliveryMethod}
                              onChange={(e) => setDeliveryMethod(e.target.value)}
                          >
                              <MenuItem value="delivery">משלוח (תוספת של 30 ש"ח)</MenuItem>
                              <MenuItem value="pickup">איסוף עצמי</MenuItem>
                          </Select>
                      </FormControl>
                      {deliveryMethod === 'delivery' && (
                          <>
                              <h6>כתובת למשלוח</h6>
                              <input type="text" name="firstName" placeholder="שם פרטי" value={newAddress.firstName} onChange={handleInputChange} />
                              <input type="text" name="lastName" placeholder="שם משפחה" value={newAddress.lastName} onChange={handleInputChange} />
                              <input type="text" name="street" placeholder="רחוב" value={newAddress.street} onChange={handleInputChange} />
                              <input type="text" name="streetNumber" placeholder="מספר" value={newAddress.streetNumber} onChange={handleInputChange} />
                              <input type="text" name="city" placeholder="עיר" value={newAddress.city} onChange={handleInputChange} />
                              <input type="text" name="postalCode" placeholder="מיקוד" value={newAddress.postalCode} onChange={handleInputChange} />
                              <input type="text" name="phone" placeholder="טלפון" value={newAddress.phone} onChange={handleInputChange} />
                              <input type="email" name="email" placeholder="אימייל" value={newAddress.email} onChange={handleInputChange} />
                          </>
                      )}
                      {deliveryMethod === 'pickup' && (
                          <>
                              <h6>פרטי איסוף עצמי</h6>
                              <input type="text" name="firstName" placeholder="שם פרטי" value={newAddress.firstName} onChange={handleInputChange} />
                              <input type="text" name="phone" placeholder="טלפון" value={newAddress.phone} onChange={handleInputChange} />
                              <input type="email" name="email" placeholder="אימייל" value={newAddress.email} onChange={handleInputChange} />
                          </>
                      )}
                      <Button variant="contained" onClick={handleAddAddress} className="continue-button">המשך</Button>
                  </div>
              )}

              {currentStep === 2 && (
                  <div className="section">
                      <h6>פרטי התשלום</h6>
                      <p>כתובת: {`${newAddress.street}, ${newAddress.streetNumber}, ${newAddress.city}, ${newAddress.postalCode}`}</p>
                      <p>אימייל: {newAddress.email}</p>
                      <p>טלפון: {newAddress.phone}</p>
                      <Button variant="contained" onClick={() => setCurrentStep(3)} className="continue-button">המשך</Button>
                  </div>
              )}

{currentStep === 3 && (
    <PayPalScriptProvider options={{ "client-id": "AdKasZ1ybt8E2Rmz2uk97exEIBoQSrq4zfQ6a605njDYTIY3MgsXj2j7pP3RBzcB8Jrn96pV_ItcDPaZ", currency: "ILS" }}>
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
            
            <div className="total-price-breakdown">
                <div className="breakdown-item">
                    <span>סה"כ עבור המוצרים:</span>
                    <span>{discountedPrice} ש"ח</span>
                </div>
                {deliveryMethod === 'delivery' && (
                    <div className="breakdown-item">
                        <span>דמי משלוח:</span>
                        <span>30 ש"ח</span>
                    </div>
                )}
                <div className="promo-code">
                    <input
                        type="text"
                        placeholder="הכנס קוד קופון"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="contained" onClick={handlePromoCodeApply}>החל</Button>
                </div>
                <div className="breakdown-item total">
                    <span>סה"כ לתשלום:</span>
                    <span>{finalPrice} ש"ח</span>
                </div>
            </div>

            <FormControlLabel
                control={
                    <Checkbox checked={isTermsChecked} onChange={(e) => setIsTermsChecked(e.target.checked)} />
                }
                label={
                    <span>
                        אני מאשר/ת את <a href="#" onClick={() => setIsModalOpen(true)}>התקנון ותנאי השימוש</a>
                    </span>
                }
            />

            <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) => {
                    if (isTermsChecked) {
                        alert('עליך לאשר את התקנון לפני ביצוע ההזמנה.');
                        return;
                    }

                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: finalPrice
                            }
                        }]
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(details => {
                        alert('תשלום הצליח! תודה ' + details.payer.name.given_name);
                        handleOrderSubmit(); // שלח את פרטי ההזמנה לאחר אישור התשלום
                    });
                }}
                onError={(err) => {
                    console.error('Error in PayPal transaction', err);
                    alert('שגיאה בתהליך התשלום');
                }}
            />
        </div>
    </PayPalScriptProvider>
)}

<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
    <Box className="terms-modal">
        <h2>תקנון ותנאי שימוש</h2>
        <p>כאן תוכל להכניס את התקנון ותנאי השימוש של האתר.</p>
        <Button onClick={() => setIsModalOpen(false)}>סגור</Button>
    </Box>
</Modal>
          </div>
      </div>
  );
};

export default CheckoutPage;