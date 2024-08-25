import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import UploadProductModal from './adminoption/UploadProductModal';
import CartPopup from './components/CartPopup';
import Header from './components/Header';
import UserPopup from './components/UserPopup';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminPage from './pages/AdminPage';
import ProtectedPage from './components/ProtectedPage';

const App = () => {
    const [cartOpen, setCartOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userPopupOpen, setUserPopupOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(() => {
        // Initialize cart item count from localStorage
        const savedCount = localStorage.getItem('cartItemCount');
        return savedCount ? parseInt(savedCount) : 0;
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleAddToCart = (product, size) => {
        const newCartItems = [...cartItems];
        const existingCartItem = newCartItems.find(item => item._id === product._id && item.size === size);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            newCartItems.push({ ...product, size, quantity: 1 });
        }

        setCartItems(newCartItems);
        const newCartItemCount = newCartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(newCartItemCount);
        localStorage.setItem('cartItemCount', newCartItemCount);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        setCartOpen(true);
    };

    const handleDeleteFromCart = (index) => {
        const newCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(newCartItems);
        
        // חישוב כמות הפריטים בעגלה לאחר מחיקת המוצר
        const newCartItemCount = newCartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(newCartItemCount);
        
        // עדכון ב-localStorage
        localStorage.setItem('cartItemCount', newCartItemCount);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    };

    const handleAddProduct = (product) => {
        console.log("Product added:", product);
        // Logic to update the state with the new product if needed
    };

    return (
        <Router>
            <Header
                onCartClick={() => setCartOpen(true)}
                onUserClick={() => setUserPopupOpen(true)}
                onUploadClick={() => setUploadModalOpen(true)}
                cartItemCount={cartItemCount} // Pass cartItemCount to Header
            />
            <Routes>
                <Route path="/" element={<HomePage onAddToCart={handleAddToCart} setCartItemCount={setCartItemCount} />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/login" element={<LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/admin" element={<ProtectedPage isAuthenticated={isAuthenticated}><AdminPage/></ProtectedPage>} />
                <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
            <CartPopup 
    open={cartOpen} 
    onClose={() => setCartOpen(false)} 
    cartItems={cartItems} 
    onDeleteFromCart={handleDeleteFromCart} 
    setCartItemCount={setCartItemCount}
/>
            <UploadProductModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onAddProduct={handleAddProduct} />
        </Router>
    );
};

export default App;