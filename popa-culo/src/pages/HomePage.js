import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import ProductDisplay from '../components/ProductDisplay';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {motion} from 'framer-motion';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        minHeight: '100vh',
        textAlign: 'center',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '16px', // Adjusted value to account for the header height
        margin: 0,
        backgroundColor: 'rgba(163,78,78,0.63)', // Set a background color instead of a video
    },
    header: {
        zIndex: 2,
        fontFamily: 'Bodoni Moda, serif', // Use the custom font
        textAlign: 'center',
        color: 'rgb(168,28,81)', // Pink from logo
        marginTop: theme.spacing(2), // Adjusted value to move the header lower
    },
    description: {
        zIndex: 2,
        color: '#a81c51', // Pink from logo
        fontFamily: 'CustomFont', // Use the custom font
        textAlign: 'center',
        marginTop: theme.spacing(1), // Adjusted value to move the description lower
    },
    buttonContainer: {
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(5), // Adjusted value to move the button lower
    },
    buttonPrimary: {
        backgroundColor: '#65103f', // Pink from logo
        color: '#3E2723', // Dark brown for text
        '&:hover': {
            backgroundColor: '#ae0000', // Lighter pink for hover
        },
    },
    carouselContainer: {
        width: '100%',
        marginTop: theme.spacing(6),
        position: 'relative',
    },
    carouselImage: {
        width: '100%',
        height: '80vh',
        objectFit: 'cover',
        objectPosition: 'center', // Adjusted for better fit on desktop
    },
    overlayText: {
        position: 'absolute',
        top: '10%', // Adjusted value for positioning the text
        width: '100%',
        textAlign: 'center',
        zIndex: 1,
        padding: theme.spacing(2),
    },
    overlayButton: {
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        textAlign: 'center',
        zIndex: 1,
    },
}));

function HomePage({ onAddToCart }) {
    const classes = useStyles();
    const [showCollections, setShowCollections] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://172.20.10.2:5001/api/products');
                console.log('Fetched products:', response.data);
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
        setShowCollections(!showCollections);
    };

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    // Sample images to display in the carousel
    const sampleImages = [
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1722232981/image1_Large_zboluw',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1722234372/image2_Large_a3upax.png',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1622231344038/image2_Large_a3upax',
        // Add more URLs as needed
    ];

    console.log('Sample images:', sampleImages);

    return (
        <Box className={classes.root}>
            <Box className={classes.carouselContainer}>
                <Box className={classes.overlayText}>
                    <motion.div
                        initial={{ opacity: 0,  y: -100 }}
                        animate={{ opacity: 1,  y: 0 }}
                        transition={{ duration: 0.8 }}


                    >

                    <Typography component="h1" variant="h2" className={classes.header}>
                        Popa Culo
                    </Typography>
                    <Typography variant="h5" className={classes.description}>
                        ברוכים הבאים לאתר שלנו! כאן תוכלו למצוא את הקולקציות היפות והאיכותיות ביותר של בגדי ים.
                    </Typography>
                    </motion.div>

                </Box>
                <Slider {...carouselSettings}>
                    {sampleImages.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Sample ${index}`}
                            className={classes.carouselImage}
                            onError={(e) => console.error('Image load error:', src, e)}
                        />
                    ))}
                </Slider>
                <Box className={classes.overlayButton}>
                    <Button variant="contained" className={classes.buttonPrimary} onClick={handleShowCollections}>
                        הקולקציות שלנו
                    </Button>
                </Box>
            </Box>
            {showCollections && (
                <Box component="section" style={{ marginTop: '40px' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" gutterBottom>
                            הקולקציות שלנו
                        </Typography>
                        <ProductDisplay
                            products={products}
                            onAddToCart={onAddToCart}
                        />
                    </Container>
                </Box>
            )}
        </Box>
    );
}

export default HomePage;