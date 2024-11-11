import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Box, Button, Container, Typography, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ProductDisplay from '../components/ProductDisplay';
import SizeChartIcon from '@mui/icons-material/TableChart';
import CloseIcon from '@mui/icons-material/Close';

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
    '.desktop-carousel': {
        display: 'block',
    },
    '.mobile-carousel': {
        display: 'none',
    },
    '@media (max-width: 768px)': {
        '.desktop-carousel': {
            display: 'none',
        },
        '.mobile-carousel': {
            display: 'block',
        },
    },
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

function HomePage({ onAddToCart ,setCartItemCount}) {
    const [products, setProducts] = useState([]);
    const [showCollections, setShowCollections] = useState(false);
    const productDisplayRef = useRef(null);
    const [openSizeChart, setOpenSizeChart] = useState(false);

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
        }, 100);
    };
    
    const handleOpenSizeChart = () => {
        setOpenSizeChart(true);
    };

    const handleCloseSizeChart = () => {
        setOpenSizeChart(false);
    };

    const desktopImages = [
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1723307921/IMG_9152_v0txoj.jpg',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1723307921/IMG_9540_kzn6zn.jpg',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1723307920/IMG_0156_x3tnqr.jpg',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1731333499/IMG_5621_z06cbe.jpg'
       
    ];

    const mobileImages = [
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1723307921/IMG_9152_v0txoj.jpg',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1723307921/IMG_9540_kzn6zn.jpg',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1723307921/IMG_7921_msicxw.jpg',
         'https://res.cloudinary.com/dnuytrlyh/image/upload/v1723307920/IMG_0156_x3tnqr.jpg',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1723307920/IMG_1585_aiti4s.jpg', 
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1731333311/IMG_5626_st523p.jpg',
        'https://res.cloudinary.com/dnuytrlyh/image/upload/v1731333311/IMG_6964_qv4sqj.jpg'
    ];

    const carouselSettings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Root>
            <CarouselContainer>
                <OverlayText>
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 2 }}
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

                {/* Desktop Images */}
                <div className="desktop-carousel">
                    <Slider {...carouselSettings}>
                        {desktopImages.map((src, index) => (
                            <CarouselImage
                                key={index}
                                src={src}
                                alt={`Desktop Image ${index}`}
                            />
                        ))}
                    </Slider>
                </div>

                {/* Mobile Images */}
                <div className="mobile-carousel">
                    <Slider {...carouselSettings}>
                        {mobileImages.map((src, index) => (
                            <CarouselImage
                                key={index}
                                src={src}
                                alt={`Mobile Image ${index}`}
                            />
                        ))}
                    </Slider>
                </div>
            </CarouselContainer>

            {/* Show collection only when products are loaded */}
            {showCollections && products.length > 0 && (
                <Box component="section" ref={productDisplayRef} sx={{ marginTop: '40px' }}>
                    <Container maxWidth="lg">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4" alignItems="center" justifyContent="center" gutterBottom>
                                Bell collection
                            </Typography>
                           {/* <Button
                                variant="contained"
                                startIcon={<SizeChartIcon />}
                                onClick={handleOpenSizeChart}
                            >
                                טבלת מידות
                            </Button>*/}
                        </Box>
                        <ProductDisplay products={products} onAddToCart={onAddToCart} onUpdateCartCount={setCartItemCount}/>
                    </Container>

                    {/* דיאלוג טבלת מידות */}
                    <Dialog open={openSizeChart} onClose={handleCloseSizeChart}>
                        <DialogTitle>
                            טבלת מידות
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseSizeChart}
                                sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent style={{ direction: 'rtl' }}>
                            {/* תוכן טבלת המידות */}
                            <Typography>מידות (סנטימטרים):</Typography>
                            <Typography>XS: 70-75</Typography>
                            <Typography>S: 75-80</Typography>
                            <Typography>M: 80-85</Typography>
                            <Typography>L: 85-90</Typography>
                            </DialogContent>
                    </Dialog>
                </Box>
            )}
        </Root>
    );
}
export default HomePage;