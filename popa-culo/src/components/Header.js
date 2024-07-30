import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Avatar, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import axios from 'axios';

const Header = ({ onCartClick, onUserClick, onUploadClick }) => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(' http://172.20.10.2:5001/api/auth/user', {
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer -1 }}>
            <Toolbar>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ width: 40, height: 40, marginRight: 8 }} />
                        <Typography variant="h6">Popa Culo</Typography>
                    </Box>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton color="inherit" onClick={onCartClick}>
                    <ShoppingCartIcon />
                </IconButton>
                {user ? (
                    <>
                        <Typography variant="h6" sx={{ marginLeft: 2, marginRight: 2 }}>שלום, {user.name}</Typography>
                        <Avatar onClick={handleMenu} sx={{ cursor: 'pointer' }}>
                            {user.name.charAt(0)}
                        </Avatar>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {user.isAdmin && (
                                <MenuItem onClick={onUploadClick}>
                                    <AddCircleIcon /> העלאת מוצר
                                </MenuItem>
                            )}
                            <MenuItem onClick={handleLogout}>התנתקות</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <IconButton color="inherit" onClick={onUserClick}>
                        <AccountCircleIcon />
                    </IconButton>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;