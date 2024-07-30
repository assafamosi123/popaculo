import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    productCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        direction: 'rtl',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    productImage: {
        maxWidth: '100%',
        maxHeight: '200px',
        borderRadius: '8px',
        cursor: 'pointer',
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
    },
    dialogImage: {
        width: '100%',
        height: 'auto',
    },
    counter: {
        textAlign: 'center',
        margin: '10px 0',
    },
}));

const ProductDisplay = ({ products, onAddToCart }) => {
    const classes = useStyles();
    const [selectedSize, setSelectedSize] = useState({});
    const [open, setOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentProductImages, setCurrentProductImages] = useState([]);

    const handleSizeChange = (index, size) => {
        setSelectedSize({ ...selectedSize, [index]: size });
    };

    const handleImageClick = (images, index) => {
        setCurrentProductImages(images);
        setCurrentImage(images[index]);
        setCurrentImageIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNext = () => {
        const nextIndex = (currentImageIndex + 1) % currentProductImages.length;
        setCurrentImage(currentProductImages[nextIndex]);
        setCurrentImageIndex(nextIndex);
    };

    const handlePrevious = () => {
        const prevIndex = (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
        setCurrentImage(currentProductImages[prevIndex]);
        setCurrentImageIndex(prevIndex);
    };

    return (
        <Box sx={{ mt: 10 }}>
            <Grid container spacing={4} justifyContent="center">
                {products.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box className={classes.productCard}>
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
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <img src={currentImage} alt="Product" className={classes.dialogImage} />
                <Box className={classes.counter}>
                    <Typography>{currentImageIndex + 1} מתוך {currentProductImages.length}</Typography>
                </Box>
                <DialogActions>
                    <Button onClick={handlePrevious} disabled={currentProductImages.length <= 1}>הקודם</Button>
                    <Button onClick={handleNext} disabled={currentProductImages.length <= 1}>הבא</Button>
                    <Button onClick={handleClose}>סגור</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductDisplay;