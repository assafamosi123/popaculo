import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import logo from '../assets/logowhite.png';
import axios from 'axios';

const Header = ({ onCartClick, onUserClick, onUploadClick, cartItemCount }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${process.env.REACT_APP_SERVER}/api/auth/user`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.log("Error fetching user:", error);
                });
        }
    }, []);

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" style={{ color: 'white' }} onClick={onCartClick}>
                        <ShoppingCartIcon />
                        <Box
                            sx={{
                                backgroundColor: 'black', // שינוי צבע הרקע לשחור
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                top: 0,
                                right: 0
                            }}
                        >
                            <Typography variant="caption" style={{ color: 'white' }}>
                                {cartItemCount}
                            </Typography>
                        </Box>
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 0 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ width: 50, height: 50, marginRight: 8 }} />
                        <Typography variant="h6" style={{ color: 'white' }}>POPA CULO</Typography>
                    </Link>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    {/* Add any other icons or elements you want on the right side of the header */}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;