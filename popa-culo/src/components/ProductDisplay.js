import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ProductCard = styled(Box)(({ theme }) => ({
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    direction: 'rtl',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    overflow: 'hidden',
}));

const ProductImage = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    borderRadius: '8px',
    cursor: 'pointer',
    objectFit: 'cover',
}));

const ProductInfo = styled(Box)(({ theme }) => ({
    marginTop: '16px',
}));

const Price = styled(Typography)(({ theme }) => ({
    marginTop: '8px',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
}));

const SizeButton = styled(Button)(({ theme }) => ({
    margin: '5px',
    flex: 1,
}));

const DialogImage = styled('img')(({ theme }) => ({
    width: '100%',
    height: 'auto',
    display: 'block',
}));

const Counter = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    margin: '10px 0',
}));

const ContainerStyled = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '1rem',
}));

const ItemStyled = styled(Grid)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'calc(50% - 1rem)',
    },
    [theme.breakpoints.up('md')]: {
        width: 'calc(33.3333% - 1rem)',
    },
}));

const SliderCounter = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
}));

const ProductDisplay = ({ products, onAddToCart }) => {
    const [selectedSize, setSelectedSize] = useState({});
    const [open, setOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentProductImages, setCurrentProductImages] = useState([]);
    const { scrollY } = useScroll();
    const parallaxEffect = useTransform(scrollY, [0, 300], [0, 2000]);

    const handleSizeChange = (index, size) => {
        setSelectedSize({ ...selectedSize, [index]: size });
    };

    const handleImageClick = (images, index) => {
        const uniqueImages = [...new Set(images)];
        setCurrentProductImages(uniqueImages);
        setCurrentImageIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <></>,
        prevArrow: <></>,
        beforeChange: (current, next) => setCurrentImageIndex(next),
    };

    return (
        <motion.div style={{ y: parallaxEffect }}>
        <Box sx={{ mt: '1rem' }}>
            <ContainerStyled container spacing={2}>
                {products.map((product, index) => {
                    const { ref, inView } = useInView({ triggerOnce: true });

                    return (
                        <ItemStyled item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                ref={ref}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 1. }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={inView ? { opacity: 1, y: 5 } : {}}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                as={ProductCard}
                            >
                                {product.images && product.images.length > 0 && (
                                    <ProductImage
                                        src={product.images[0]}
                                        alt={`Product ${index} Main Image`}
                                        onClick={() => handleImageClick(product.images, 0)}
                                    />
                                )}
                                <ProductInfo>
                                    <Typography variant="h6">{product.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">{product.description}</Typography>
                                    <Price variant="h6">{product.price} ש"ח</Price>
                                    <Box>
                                        <Typography variant="body2">בחר מידה:</Typography>
                                        <div style={{ display: 'flex', flexDirection: 'row-reverse', width: '100%' }}>
                                            {['S', 'M', 'L'].map((size) => (
                                                <SizeButton
                                                    key={size}
                                                    variant={selectedSize[index] === size ? 'contained' : 'outlined'}
                                                    color="primary"
                                                    onClick={() => handleSizeChange(index, size)}
                                                >
                                                    {size}
                                                </SizeButton>
                                            ))}
                                        </div>
                                    </Box>
                                </ProductInfo>
                                <ButtonGroup>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => onAddToCart(product, selectedSize[index])}
                                        disabled={!selectedSize[index]}
                                    >
                                        הוסף לסל
                                    </Button>
                                </ButtonGroup>
                            </motion.div>
                        </ItemStyled>
                    );
                })}
            </ContainerStyled>
            <Dialog open={open} onClose={handleClose}>
                <Box position="relative">
                    {currentProductImages.length > 1 ? (
                        <Slider {...settings}>
                            {currentProductImages.map((image, index) => (
                                <div key={image}>
                                    <DialogImage src={image} alt={`Product Image ${index}`} />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div onClick={handleClose} key={currentProductImages[0]}>
                            <DialogImage src={currentProductImages[0]} alt={`Product Image ${0}`} />
                        </div>
                    )}
                    <SliderCounter>
                        {currentImageIndex + 1} / {currentProductImages.length}
                    </SliderCounter>
                </Box>
            </Dialog>
        </Box>
        </motion.div>
    );
};

export default ProductDisplay;