import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import UploadProductModal from './adminoption/UploadProductModal';
import CartPopup from './components/CartPopup';
import Header from './components/Header';
import UserPopup from './components/UserPopup';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';

const App = () => {
    const [cartOpen, setCartOpen] = useState(false);
    const [userPopupOpen, setUserPopupOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (product, size) => {
        setCartItems([...cartItems, { ...product, size, quantity: 1 }]);
        setCartOpen(true);
    };

    const handleDeleteFromCart = (index) => {
        const newCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(newCartItems);
    };

    const handleAddProduct = (product) => {
        console.log("Product added:", product);
        // Logic to update the state with the new product if needed
    };

    return (
        <Router>
            <AppContent
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
                userPopupOpen={userPopupOpen}
                setUserPopupOpen={setUserPopupOpen}
                uploadModalOpen={uploadModalOpen}
                setUploadModalOpen={setUploadModalOpen}
                cartItems={cartItems}
                handleAddToCart={handleAddToCart}
                handleDeleteFromCart={handleDeleteFromCart}
                handleAddProduct={handleAddProduct} // Pass the handleAddProduct function
            />
        </Router>
    );
};

const AppContent = ({ cartOpen, setCartOpen, userPopupOpen, setUserPopupOpen, uploadModalOpen, setUploadModalOpen, cartItems, handleAddToCart, handleDeleteFromCart, handleAddProduct }) => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setCartOpen(false);
        navigate('/checkout', { state: { cartTotal } });
    };

    return (
        <>
            <Header
                onCartClick={() => setCartOpen(true)}
                onUserClick={() => setUserPopupOpen(true)}
                onUploadClick={() => setUploadModalOpen(true)}
            />
            <Routes>
                <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
                <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
            <CartPopup open={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} onDeleteFromCart={handleDeleteFromCart} onCheckout={handleCheckout} />
            <UserPopup open={userPopupOpen} onClose={() => setUserPopupOpen(false)} />
            <UploadProductModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onAddProduct={handleAddProduct} />
        </>
    );
};

export default App;