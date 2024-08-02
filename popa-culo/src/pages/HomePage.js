import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ProductDisplay from '../components/ProductDisplay';


const Root = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100vw',
    height: '100vh',
    textAlign: 'center',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'revert-layer',
    alignItems: 'center',
    margin: 0,
    backgroundColor: 'rgba(163,78,78,0.63)',
    overflowX: 'hidden',
}));

const Header = styled('div')(({ theme }) => ({
    zIndex: 2,
    fontFamily: 'Cinzel Decorative, sans-serif',
    textAlign: 'center',
    color: 'rgb(168,28,81)',
    margin: '30px',
}));

const ButtonPrimary = styled(Button)(({ theme }) => ({
    backgroundColor: '#65103f',
    color: '#3E2723',
    '&:hover': {
        backgroundColor: '#ae0000',
        zIndex: 2,
    },
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    marginTop: 'auto',
    position: 'static',
}));

const CarouselImage = styled('img')(({ theme }) => ({
    width: '100%',
    height: '100vh',
    objectFit: 'cover',
    objectPosition: 'center',
    position: 'relative',
}));

const OverlayText = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '10%',
    width: '100%',
    textAlign: 'center',
    zIndex: 1,
    padding: 2,
    marginTop: '0px',
}));

const OverlayButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
}));

function HomePage({ onAddToCart }) {
    const [showCollections, setShowCollections] = useState(false);
    const [showScrollMessage, setShowScrollMessage] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/products`);
                const productsWithImages = response.data.map(product => ({
                    ...product,
                }));
                setProducts(productsWithImages);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleShowCollections = () => {
        if (showCollections) {
            setShowScrollMessage(false);
        } else {
            setShowScrollMessage(true);
            setTimeout(() => {
                setShowScrollMessage(false);
            }, 3000); // Hide the message after 3 seconds
        }
        setShowCollections(!showCollections);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setShowScrollMessage(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const carouselSettings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const sampleImages = [
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1722232981/image1_Large_zboluw',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1722234372/image2_Large_a3upax.png',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1622231344038/image2_Large_a3upax',
    ];

    return (
        <Root>
            <CarouselContainer>
                <OverlayText>
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography component="h1" variant="h2" sx={{ color: 'rgb(168,28,81)', marginBottom: '10px' }}>
                            Popa Culo
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#a81c51', fontFamily: 'CustomFont', textAlign: 'center', marginTop: '20px' }}>
                            ברוכים הבאים לאתר שלנו! כאן תוכלו למצוא את הקולקציות היפות והאיכותיות ביותר של בגדי ים.
                        </Typography>
                    </motion.div>
                </OverlayText>
                <Slider {...carouselSettings}>
                    {sampleImages.map((src, index) => (
                        <CarouselImage
                            key={index}
                            src={src}
                            alt={`Sample ${index}`}
                        />
                    ))}
                </Slider>
                <OverlayButton variant="contained" onClick={handleShowCollections}>
                    הקולקציות שלנו
                </OverlayButton>
            </CarouselContainer>
            {showCollections && (
                <Box component="section" sx={{ marginTop: '40px' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" gutterBottom>
                            הקולקציות שלנו
                        </Typography>
                        <ProductDisplay products={products} onAddToCart={onAddToCart} />
                    </Container>
                </Box>
            )}
            {showScrollMessage && (
    <motion.div
        initial={{ opacity: 0, y: 1 }}
        animate={{ opacity: 1, y: 3 }}
        transition={{ duration: 0.5 }}
        style={{
            position: 'fixed',
            top: '80%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 20px',
            borderRadius: '10px',
            color: '#fff',
            zIndex: 1000,  // Higher z-index to ensure it's on top
        
            // Ensures it doesn’t interfere with other interactions
        }}
    >
        Scroll down to see the collection!
    </motion.div>
)}
        </Root>
    );
}

export default HomePage;