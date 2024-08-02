import React from 'react';
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
    width: 300,
    top: '20px',
}));

const CartTitle = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const ListItemImage = styled('img')(({ theme }) => ({
    marginRight: theme.spacing(2),
    width: 50,
    height: 50,
    objectFit: 'cover',
}));

const CartPopup = ({ open, onClose, cartItems, onDeleteFromCart }) => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout', { state: { cartItems } });
        onClose(); // סגירת העגלה אחרי הניווט
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
                                primary={item.name}
                                secondary={`מחיר: ${item.price} ש"ח, מידה: ${item.size}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteFromCart(index)}>
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
                    ֹֹֹֹֹֹ לתשלום
                </Button>
            </Box>
        </DrawerPaper>
    );
};

export default CartPopup;