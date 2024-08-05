import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Modal, Box } from '@mui/material';
import './CheckoutStyles.css';

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

    const handleOrderSubmit = () => {
        if (!isTermsChecked) {
            alert('עליך לאשר את התקנון לפני ביצוע ההזמנה.');
            return;
        }

        const storedAddress = JSON.parse(localStorage.getItem('userAddress'));
        if (!storedAddress) {
            alert('אנא הוסף כתובת לפני ביצוע ההזמנה');
            return;
        }

        axios.post(`${process.env.REACT_APP_SERVER}/api/send-order-email`, {
            address: storedAddress,
            cartItems,
            deliveryMethod // הוספנו את סוג ההזמנה
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
                              <h6 >בחר שיטת משלוח </h6>
                              <FormControl fullWidth>
                                  
                                  <Select
                                      labelId="delivery-method-label"
                                      value={deliveryMethod}
                                      onChange={(e) => setDeliveryMethod(e.target.value)}
                                  >
                                      <MenuItem value="delivery">משלוח</MenuItem>
                                      <MenuItem value="pickup">איסוף עצמי</MenuItem>
                                  </Select>
                              </FormControl>
                              {deliveryMethod === 'delivery' && (
                                  <>
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
                                  </>
                              )}
                              {deliveryMethod === 'pickup' && (
                                  <>
                                      <h6>פרטי איסוף עצמי</h6>
                                      <input
                                          type="text"
                                          name="firstName"
                                          placeholder="שם פרטי"
                                          value={newAddress.firstName}
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
                                  </>
                              )}
                              <Button variant="contained" color="primary" onClick={handleAddAddress}>
                                  המשך
                              </Button>
                          </div>
                      )}
                      {currentStep === 2 && (
                          <div className="section">
                              {deliveryMethod === 'delivery' ? (
                                  <>
                                      <h6>פרטי המשלוח</h6>
                                      <p>כתובת: {newAddress.street}, {newAddress.streetNumber}, {newAddress.city}</p>
                                      <p>אימייל: {newAddress.email}</p>
                                      <p>טלפון: {newAddress.phone}</p>
                                  </>
                              ) : (
                                  <>
                                      <h6>פרטי איסוף עצמי</h6>
                                      <p>שם: {newAddress.firstName}</p>
                                      <p>אימייל: {newAddress.email}</p>
                                      <p>טלפון: {newAddress.phone}</p>
                                  </>
                              )}
                              <Button variant="contained" color="primary" onClick={() => setCurrentStep(3)}>
                                  המשך
                              </Button>
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
                                  <Button variant="outlined" color="primary" onClick={handlePromoCodeApply}>
                                      החל
                                  </Button>
                              </div>
                              <div className="total-price">
                                  <span>סה"כ:</span>
                                  <span>{discountedPrice} ש"ח</span>
                              </div>
                              <div className="terms">
                                  <FormControlLabel
                                      control={
                                          <Checkbox
                                              checked={isTermsChecked}
                                              onChange={(e) => setIsTermsChecked(e.target.checked)}
                                              color="primary"
                                          />
                                      }
                                      label={
                                          <span>
                                              אני מאשר/ת את{' '}
                                              <span onClick={() => setIsModalOpen(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}>
                                                  התקנון ותנאי השימוש
                                              </span>
                                          </span>
                                      }
                                  />
                              </div>
                              <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleOrderSubmit}
                                  disabled={!isTermsChecked} // Disable button if terms are not checked
                              >
                                  בצע הזמנה
                              </Button>
                          </div>
                      )}
                  </form>
              </div>
          </div>

          {/* Modal for terms and conditions */}
          <Modal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              aria-labelledby="terms-modal-title"
              aria-describedby="terms-modal-description"
          >
              <Box sx={{ maxWidth: 600, margin: 'auto', marginTop: '10%', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
                  <h2 id="terms-modal-title">תקנון ותנאי השימוש</h2>
                  <p id="terms-modal-description">
                      כאן יופיע הטקסט של התקנון ותנאי השימוש...
                  </p>
                  <Button onClick={() => setIsModalOpen(false)} variant="contained" color="primary">
                      סגור
                  </Button>
              </Box>
          </Modal>
      </div>
  );
};

export default CheckoutPage;