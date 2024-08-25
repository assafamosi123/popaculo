import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'

const LoginPage = ({ isAuthenticated, setIsAuthenticated }) => {

    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password || (!isLogin && (!name || password !== confirmPassword))) {
            setError('אנא מלא את כל השדות וודא שהסיסמאות תואמות.');
            return;
        }

        if (!isValidEmail(email)) {
            setError('אנא הזן כתובת מייל תקינה.');
            return;
        }

        try {
            let response;

            if (isLogin) {
                response = await axios.post(`${process.env.REACT_APP_SERVER}/api/auth/login`, { email, password });
            } else {
                response = await axios.post(`${process.env.REACT_APP_SERVER}/api/auth/register`, { name, email, password });
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log(response.data);
            setIsLogin(true);
        } catch (error) {
            setError('המייל או הסיסמא אינם');
        }
    };

  return (
    <div className="checkout-page" style={{textAlign: 'center'}}>
        <header className="checkout-header">
            <h1>התחברות</h1>
        </header>
        <Typography>
                    {isLogin ? 'אנא הכנס את פרטי ההתחברות שלך כדי להתחבר.' : 'אנא הכנס את הפרטים שלך כדי להירשם.'}
            </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {!isLogin && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="שם"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <TextField
                        autoFocus={isLogin}
                        margin="dense"
                        id="email"
                        label="מייל"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="סיסמה"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogin && (
                        <TextField
                            margin="dense"
                            id="confirm-password"
                            label="אימות סיסמה"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}
                    {error && <Alert severity="error">{error}</Alert>}
                    <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem'}}>
                        <Button onClick={toggleForm}>
                            {isLogin ? 'אין לך חשבון? הירשם כאן' : 'כבר יש לך חשבון? התחבר כאן'}
                        </Button>
                        <Button type="submit">{isLogin ? 'התחבר' : 'הירשם'}</Button>
                    </div>
                </Box>
    </div>
  )
}

export default LoginPage