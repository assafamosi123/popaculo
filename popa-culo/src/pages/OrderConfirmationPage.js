import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const { orderNumber } = location.state || {};
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Paper elevation={3} sx={{ padding: '40px', textAlign: 'center', width: '100%' }}>
                <Typography variant="h4" gutterBottom>
                    ההזמנה הושלמה בהצלחה!
                </Typography>
                <Typography variant="h6" sx={{ marginTop: '20px', color: 'primary.main' }}>
                    מספר ההזמנה שלך הוא: <strong>{orderNumber}</strong>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: '20px' }}>
                    לכל מידע נוסף מוזמנים לפנות אלינו בעמוד האינסטגרם שלנו @popaculo
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '30px', padding: '10px 20px' }}
                    onClick={handleBackToHome}
                >
                    לסיום וחזרה למסך הבית לחץ כאן
                </Button>
            </Paper>
        </Container>
    );
};

export default OrderConfirmationPage;