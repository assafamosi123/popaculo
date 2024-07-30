import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        backgroundColor: '#8B4513',
        color: 'white',
    },
    dialogContent: {
        backgroundColor: '#FAEBD7',
    },
    dialogActions: {
        backgroundColor: '#FAEBD7',
    },
}));

const UploadProductModal = ({ open, onClose, onAddProduct, editingProduct }) => {
    const classes = useStyles();
    const [productName, setProductName] = useState('');
    const [productImages, setProductImages] = useState([]);
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        if (editingProduct) {
            setProductName(editingProduct.name);
            setProductDescription(editingProduct.description);
            setProductPrice(editingProduct.price);
            setPreviewImages(editingProduct.images);
        }
    }, [editingProduct]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setProductImages(files);
        const imagePreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(imagePreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (productName && productImages.length > 0 && productDescription && productPrice) {
            const formData = new FormData();
            formData.append('name', productName);
            formData.append('description', productDescription);
            formData.append('price', productPrice);
            productImages.forEach(image => {
                formData.append('images', image);
            });

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:5001/api/products', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const newProduct = response.data;

                onAddProduct(newProduct);
                onClose();

                setProductName('');
                setProductImages([]);
                setProductDescription('');
                setProductPrice('');
                setPreviewImages([]);
            } catch (error) {
                console.error('Error uploading product:', error);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle className={classes.dialogTitle}>{editingProduct ? 'ערוך מוצר' : 'העלה מוצר חדש'}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="שם המוצר"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        margin="normal"
                    />
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                    />
                    <Box display="flex" flexWrap="wrap" style={{ marginTop: '20px' }}>
                        {previewImages.map((src, index) => (
                            <Box key={index} margin="10px">
                                <img
                                    src={src}
                                    alt={`Preview ${index}`}
                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                />
                            </Box>
                        ))}
                    </Box>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="תיאור מוצר"
                        multiline
                        rows={4}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="מחיר"
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        margin="normal"
                    />
                    <DialogActions className={classes.dialogActions}>
                        <Button onClick={onClose} color="secondary">בטל</Button>
                        <Button type="submit" color="primary">{editingProduct ? 'שמור שינויים' : 'הוסף מוצר'}</Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UploadProductModal;