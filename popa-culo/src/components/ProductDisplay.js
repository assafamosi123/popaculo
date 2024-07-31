import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { makeStyles } from '@mui/styles';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const useStyles = makeStyles((theme) => ({
    productCard: {
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
    },
    productImage: {
        maxWidth: '100%',
        borderRadius: '8px',
        cursor: 'pointer',
        objectFit: 'cover',
    },
    productInfo: {
        marginTop: '16px',
    },
    price: {
        marginTop: '8px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
    },
    buttonGroup: {
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    sizeButton: {
        margin: '5px',
        flex: 1,
    },
    dialogImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },
    counter: {
        textAlign: 'center',
        margin: '10px 0',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '1rem',
    },
    item: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 'calc(50% - 1rem)',
        },
        [theme.breakpoints.up('md')]: {
            width: 'calc(33.3333% - 1rem)',
        },
    },
    sliderCounter: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
    }
}));

const ProductDisplay = ({ products, onAddToCart }) => {
    const classes = useStyles();
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
            <Grid container className={classes.container}>
                {products.map((product, index) => {
                    const { ref, inView } = useInView({ triggerOnce: true });

                    return (
                        <Grid className={classes.item} item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                ref={ref}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={inView ? { opacity: 1, y: 5 } : {}}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={classes.productCard}
                            >
                                {product.images && product.images.length > 0 && (
                                    <img
                                        src={product.images[0]}
                                        alt={`Product ${index} Main Image`}
                                        className={classes.productImage}
                                        onClick={() => handleImageClick(product.images, 0)}
                                    />
                                )}
                                <Box className={classes.productInfo}>
                                    <Typography variant="h6">{product.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">{product.description}</Typography>
                                    <Typography variant="h6" className={classes.price}>{product.price} ש"ח</Typography>
                                    <Box>
                                        <Typography variant="body2">בחר מידה:</Typography>
                                        <div style={{ display: 'flex', flexDirection: 'row-reverse', width: '100%' }}>
                                            {['S', 'M', 'L'].map((size) => (
                                                <Button
                                                    key={size}
                                                    variant={selectedSize[index] === size ? 'contained' : 'outlined'}
                                                    color="primary"
                                                    onClick={() => handleSizeChange(index, size)}
                                                    className={classes.sizeButton}
                                                >
                                                    {size}
                                                </Button>
                                            ))}
                                        </div>
                                    </Box>
                                </Box>
                                <Box className={classes.buttonGroup}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => onAddToCart(product, selectedSize[index])}
                                        disabled={!selectedSize[index]}
                                    >
                                        הוסף לסל
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                    );
                })}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <Box position="relative">
                    {currentProductImages.length > 1 ? (
                        <Slider {...settings}>
                            {currentProductImages.map((image, index) => (
                                <div key={image}>
                                    <img src={image} alt={`Product Image ${index}`} className={classes.dialogImage} />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div onClick={handleClose} key={currentProductImages[0]}>
                            <img src={currentProductImages[0]} alt={`Product Image ${0}`} className={classes.dialogImage} />
                        </div>
                    )}
                    <Box className={classes.sliderCounter}>
                        {currentImageIndex + 1} / {currentProductImages.length}
                    </Box>
                </Box>
            </Dialog>
        </Box>
        </motion.div>
    );
};

export default ProductDisplay;