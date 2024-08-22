import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const DrawerPaper = styled(Drawer)(({ theme }) => ({
    width: 400, // הגדלת הרוחב
    top: '20px',
}));

const CartTitle = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // יישור רווח בין הפריטים
    padding: theme.spacing(2),
    direction: 'rtl',
    backgroundColor: '#f9f9f9', // רקע בהיר לפריטים
    marginBottom: theme.spacing(1),
    borderRadius: '8px',
}));

const ListItemImage = styled('img')(({ theme }) => ({
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(1),
    width: 80, // הגדלת גודל התמונה
    height: 80,
    objectFit: 'cover',
    borderRadius: '8px',
}));

const CartPopup = ({ open, onClose ,setCartItemCount}) => {
    const [cartItems, setCartItems] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCartItems);
    }, [open]);

    const handleDeleteFromCart = (index) => {
    // הסרת המוצר מהרשימה בעגלה
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);

    // חישוב כמות הפריטים בעגלה לאחר המחיקה
    const newCartItemCount = newCartItems.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(newCartItemCount);

    // עדכון ה-localStorage
    localStorage.setItem('cartItemCount', newCartItemCount);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
};

const handleIncreaseQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity += 1;
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    const newCartItemCount = updatedCartItems.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(newCartItemCount);
    localStorage.setItem('cartItemCount', newCartItemCount);
};


     const handleDecreaseQuantity = (index) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].quantity > 1) {
            updatedCartItems[index].quantity -= 1;
        } else {
            updatedCartItems.splice(index, 1);
        }
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        const newCartItemCount = updatedCartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(newCartItemCount);
        localStorage.setItem('cartItemCount', newCartItemCount);
    };
    const handleCheckout = () => {
        navigate('/checkout', { state: { cartItems } });
        onClose();
    };

    if (!cartItems) {
        return null;
    }

    return (
        <DrawerPaper
            anchor="left"
            open={open}
            onClose={onClose}
        >
            <CartTitle>
                <Typography variant="h6">עגלת הקניות</Typography>
            </CartTitle>
            <Divider />
            <List>
                {cartItems.length === 0 ? (
                    <ListItemStyled>
                        <ListItemText primary="אין מוצרים בעגלה" />
                    </ListItemStyled>
                ) : (
                    cartItems.map((item, index) => (
                        <ListItemStyled key={index}>
    <ListItemImage src={item.images[0]} alt={item.name} />
    <ListItemText
        primary={<Typography variant="subtitle1">{item.name}</Typography>}
        secondary={
            <Typography component="div" variant="body1">
                מחיר: {item.price} ש"ח, מידה: {item.size}
                <Box display="flex" alignItems="center" mt={1}>
                    <Button variant="outlined" size="small" onClick={() => handleDecreaseQuantity(index)}>-</Button>
                    <Typography mx={2} component="span">{item.quantity}</Typography>
                    <Button variant="outlined" size="small" onClick={() => handleIncreaseQuantity(index)}>+</Button>
                </Box>
            </Typography>
        }
    />
    <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFromCart(index)}>
            <DeleteIcon />
        </IconButton>
    </ListItemSecondaryAction>
</ListItemStyled>
                    ))
                )}
            </List>
            <Divider />
            <Box p={2}>
                <Typography variant="h6">
                    סה"כ: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)} ש"ח
                </Typography>
                <Button variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }} 
                    onClick={handleCheckout}>
                    לתשלום
                </Button>
            </Box>
        </DrawerPaper>
    );
};

export default CartPopup;