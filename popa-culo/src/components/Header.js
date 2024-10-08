import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import logo from '../assets/logowhite.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

const Header = ({ onCartClick, onUserClick, onUploadClick, cartItemCount }) => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
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
                <Box sx={{ display: 'flex' }}></Box>
                {/*</AppBar><Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {user ? (
                        <>
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
                </Box>*/}
            </Toolbar>
        </AppBar>
    );
};

export default Header;