import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'; // הוספת Alert עבור הודעות שגיאה
import axios from 'axios';

function UserPopup({ open, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // הוספת פעולות לבדוק אם המשתמש מחובר
        }
    }, [onClose]);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
            onClose();
            window.location.reload(); // רענון הדף כדי לעדכן את ה-Header
        } catch (error) {
            setError('המייל או הסיסמא אינם');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isLogin ? 'התחברות' : 'הרשמה'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {isLogin ? 'אנא הכנס את פרטי ההתחברות שלך כדי להתחבר.' : 'אנא הכנס את הפרטים שלך כדי להירשם.'}
                </DialogContentText>
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
                    <DialogActions>
                        <Button onClick={toggleForm}>
                            {isLogin ? 'אין לך חשבון? הירשם כאן' : 'כבר יש לך חשבון? התחבר כאן'}
                        </Button>
                        <Button onClick={onClose}>ביטול</Button>
                        <Button type="submit">{isLogin ? 'התחבר' : 'הירשם'}</Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default UserPopup;