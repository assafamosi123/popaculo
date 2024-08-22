import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Checkbox, FormControlLabel, Select, MenuItem, FormControl, Modal, Box, Typography } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './CheckoutStyles.css';
const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [deliveryMethod, setDeliveryMethod] = useState('delivery');
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
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const promoCodeRef = useRef(promoCode);
    const [cartItems, setCartItems] = useState(location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems')) || []);
    const finalPriceRef = useRef(0);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({
            ...newAddress,
            [name]: value
        });
    };

    const deliveryFee = 30;

    useEffect(() => {
        if (!location.state?.cartItems) {
            const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItems(storedCartItems);
        }
    }, [location.state]);
    

    const calculateFinalPrice = () => {
        const totalPrice = cartItems.reduce((acc, item) => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQuantity = parseInt(item.quantity) || 1;
            return acc + itemPrice * itemQuantity;
        }, 0);
    
        const discountedPrice = (totalPrice - (totalPrice * discount)).toFixed(2);
        const final = (parseFloat(discountedPrice) + (deliveryMethod === 'delivery' ? deliveryFee : 0)).toFixed(2);

        finalPriceRef.current = final;
        return final;
    };
    
    useEffect(() => {
        calculateFinalPrice(); // חישוב המחיר הסופי כשמשהו משתנה
    }, [cartItems, discount, deliveryMethod]);

    const handlePromoCodeApply = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/api/check-promo-code`, { promoCode });
            
    
            if (response.data.valid) {
                setDiscount(response.data.discount); 
              
               // Apply the discount returned from the server
                alert('קוד הנחה הוחל בהצלחה!');
            } else {
                setDiscount(0);
                alert('קוד הנחה לא חוקי או פג תוקף');
            }
        } catch (error) {
            console.error('Error checking promo code:', error);
            alert('שגיאה בבדיקת קוד הנחה');
        }
    };
    const createPayPalOrder = async (data, actions,promoCode) => {
        try {
            
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/api/create-order`, {
                cartItems,
                promoCode:promoCodeRef.current,
                deliveryMethod,
            });

            const { id } = response.data;

            // Create the order in PayPal with the ID from the server response
            return id;
        } catch (error) {
            console.error('Error creating PayPal order:', error);
            alert('שגיאה ביצירת ההזמנה בפייפאל');
            return actions.reject(); // Reject the order creation in case of an error
        }
    }

    const handleAddAddress = () => {
        localStorage.setItem('userAddress', JSON.stringify(newAddress));
        setCurrentStep(2);
    };
    const promoCodeChange = (e) => {
        setPromoCode(e.target.value); 
       
    }
   
    useEffect(() => {
        promoCodeRef.current = promoCode;
    }, [promoCode]);

   
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
            <div className="checkout-content">
                {currentStep === 1 && (
                    <div className="section">
                        <h6>שיטת משלוח</h6>
                        <FormControl fullWidth>
                            <Select
                                labelId="delivery-method-label"
                                id="delivery-method"
                                value={deliveryMethod}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                            >
                                <MenuItem value="delivery">משלוח (תוספת של 30 ש"ח)</MenuItem>
                                <MenuItem value="pickup">איסוף עצמי מגני תקווה או קריית אונו </MenuItem>
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
    <PayPalScriptProvider options={{ "client-id": "ASy1080U8X4oN9b6-Xswql6HVtWkyG0a4_mXHCnSB__Rx3OOz2YLfOL_3nxPz7hgA-voqLKocxSGqcnt", currency: "ILS" }}>
        <div className="section">
            <h6>סקירת הזמנה</h6>
            <ul className="cart-items">
                {cartItems.map((item, index) => (
                    <li key={index}>
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
                
                </div>
                {deliveryMethod === 'delivery' && (
                    <div className="breakdown-item">
                        <span>דמי משלוח:</span>
                        <span>{deliveryFee} ש"ח</span>
                    </div>
                )}
                <div className="promo-code">
                <input
                    type="text"
                    placeholder="הכנס קוד קופון"
                    value={promoCode}
                    onChange={promoCodeChange}
                />
                <Button variant="contained" onClick={handlePromoCodeApply}>החל</Button>
            </div>
            <div className="breakdown-item total">
                <span>סה"כ לתשלום:</span>
                <span>{finalPriceRef.current} ש"ח</span> {/* שימוש ב-finalPriceRef */}
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
        {isLoading && (
<div className="loading-overlay">
    <div className="spinner">...אייקון טעינה...</div>
</div>
)}

<PayPalButtons
    style={{ layout: 'vertical' }}
    disabled={!isTermsChecked}
    createOrder={(data ,actions) => createPayPalOrder(data,actions, promoCode)}
    onApprove={async (data, actions) => {
        setIsLoading(true);
        try {
            const captureResponse = await actions.order.capture();
            const orderId = data.orderID;

            await axios.post(`${process.env.REACT_APP_SERVER}/api/confirm-order/${orderId}`);

            alert("הזמנה הושלמה בהצלחה!");
            navigate('/order-confirmation', { state: { orderId, cartItems, newAddress } });
        } catch (error) {
            console.error('Error capturing PayPal order:', error);
            alert('שגיאה בתהליך אישור ההזמנה');
        } finally {
            setIsLoading(false);
        }
    }}
    onError={async (err) => {
        console.error('Error in PayPal transaction', err);
        alert('שגיאה בתהליך התשלום');

        // Delete the order in case of an error
        try {
            await axios.post(`${process.env.REACT_APP_SERVER}/api/delete-order`, { orderId: data.orderID });
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    }}
/>
        </div>
    </PayPalScriptProvider>
)}

<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
<Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'background.paper',
    padding: 4,
    overflowY: 'auto', // מאפשר גלילה אנכית אם התוכן חורג מהגובה
    borderRadius: '8px',
    boxShadow: 24,
    outline: 'none',
    direction : 'rtl',
}}>
    <Typography variant="h6" gutterBottom>
        תקנון ותנאי שימוש
    </Typography>
    <Typography variant="body1" paragraph>
        ברוכים הבאים לחנות הבגדי ים שלנו. אנו מבקשים לקרוא בעיון את התקנון ותנאי השימוש לפני רכישת מוצר מהחנות. עצם השימוש באתר ורכישת מוצרים מהווה הסכמה לתנאים אלו.
        <br /><br />
        <strong>מדיניות רכישה ותשלום</strong>
        <br />
        כל הרכישות המתבצעות דרך האתר מאובטחות בצורה מלאה. ניתן לשלם באמצעות כרטיסי אשראי, PayPal או כל אמצעי תשלום אחר כפי שיתעדכן מעת לעת.
        <br />
        כל המחירים באתר כוללים מע"מ, אלא אם צוין אחרת.
        <br /><br />
        <strong>מדיניות משלוחים</strong>
        <br />
        אנו מספקים שירותי משלוח לכל חלקי הארץ, וזמן המשלוח עשוי להשתנות בהתאם למיקום הלקוח. אנו מתחייבים לעשות את מירב המאמצים כדי לספק את המוצרים במהירות האפשרית.
        <br />
        מרגע שהמוצר יצא לדרך, האחריות על המשלוח עוברת לשירות המשלוחים. במקרה של בעיה כלשהי, אנו נסייע ככל האפשר לפתרון הבעיה.
        <br /><br />
        <strong>מדיניות החזרות והחלפות</strong>
        <br />
        בהתאם לאופי המוצרים המוצעים בחנות (בגדי ים), לא ניתן לבצע החזרות או החלפות על מוצרים שנרכשו.
        <br />
        <strong>אחריות ושירות לקוחות</strong>
        <br />
        האחריות על המוצרים היא בהתאם לתנאים המפורטים על ידי היצרן. החנות לא תישא באחריות לנזק הנגרם כתוצאה משימוש לא נכון במוצר.
        <br />
        אנו זמינים לכל שאלה, בקשה או בעיה  בעמוד האינסטגרם שלנו @popaculo ונשמח לעמוד לרשותכם.
    </Typography>
    <Button onClick={() => setIsModalOpen(false)} variant="contained" sx={{ mt: 2 }}>
        סגור
    </Button>
</Box>
</Modal>
    </div>
</div>
);
};

export default CheckoutPage;