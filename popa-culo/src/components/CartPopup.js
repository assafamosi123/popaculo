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
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 100,
        flexShrink: 0,
        top: '5px',
    },
    drawerPaper: {
        width: 250,
        top: '10px',
    },
    cartTitle: {
        padding: theme.spacing(3),
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
    },
    listItemText: {
        flex: 1,
    },
    listItemImage: {
        marginRight: theme.spacing(2),
        width: 50,
        height: 50,
        objectFit: 'cover',
    },
}));

const CartPopup = ({ open, onClose, cartItems, onDeleteFromCart }) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout', { state: { cartItems } });
    };

    if (!cartItems) {
        return null;
    }

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Box className={classes.cartTitle}>
                <Typography variant="h6">עגלת הקניות</Typography>
            </Box>
            <Divider />
            <List>
                {cartItems.length === 0 ? (
                    <ListItem>
                        <ListItemText primary="אין מוצרים בעגלה" />
                    </ListItem>
                ) : (
                    cartItems.map((item, index) => (
                        <ListItem key={index} className={classes.listItem}>
                            <img src={item.images[0]} alt={item.name} className={classes.listItemImage} />
                            <ListItemText
                                className={classes.listItemText}
                                primary={item.name}
                                secondary={`מחיר: ${item.price} ש"ח, מידה: ${item.size}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteFromCart(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                )}
            </List>
            <Divider />
            <Box p={2}>
                <Typography variant="h6">
                    סה"כ: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)} ש"ח
                </Typography>
                <Button variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }} onClick={handleCheckout}>
                    מעבר לתשלום
                </Button>
            </Box>
        </Drawer>
    );
};

export default CartPopup;