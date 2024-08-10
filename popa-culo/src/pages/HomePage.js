import React, { useEffect, useState, useRef } from 'react';
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
    backgroundColor: '#e9d3d3',
    overflowX: 'hidden',
}));

const Header = styled('div')(({ theme }) => ({
    zIndex: 2,
    textAlign: 'center',
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '10%',
    width: '100%',
    textAlign: 'center',
    zIndex: 1,
    padding: 4,
    marginTop: '10px',
}));

const OverlayButton = styled(Button)(({ theme }) => ({
    marginTop: '20px',
    zIndex: 2,
    alignSelf: 'center',
}));

function HomePage({ onAddToCart }) {
    const [showCollections, setShowCollections] = useState(false);
    const [products, setProducts] = useState([]);
    const productDisplayRef = useRef(null);

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
        setShowCollections(true);
        setTimeout(() => {
            if (productDisplayRef.current) {
                productDisplayRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Delay to allow the rendering of `ProductDisplay`
    };

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
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1722943068/background3_osayet.png',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1722943068/background2_mzckxx.png',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1722943068/backgroun1_mqa1qs.png'
    ];

    return (
        <Root>
            <CarouselContainer>
                <OverlayText>
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 2}}
                    >
                        <Typography component="h1" variant="h2" sx={{ color: 'white', marginBottom: '10px' }}>
                            Popa Culo
                        </Typography>
                        <Typography style={{ color: 'white', textAlign: 'center', fontSize: '20px' }}>
                            hand made swimwear
                        </Typography>
                    </motion.div>
                    <OverlayButton variant="contained" onClick={handleShowCollections}>
                        shop now
                    </OverlayButton>
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
            </CarouselContainer>
            {showCollections && (
                <Box component="section" ref={productDisplayRef} sx={{ marginTop: '40px' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" gutterBottom>
                            לקולקציית מה שענבר ותמר יבחרו
                        </Typography>
                        <ProductDisplay products={products} onAddToCart={onAddToCart} />
                    </Container>
                </Box>
            )}
        </Root>
    );
}

export default HomePage;