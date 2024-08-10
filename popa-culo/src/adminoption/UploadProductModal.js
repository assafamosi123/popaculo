import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box
} from '@mui/material';

const UploadProductModal = ({ open, onClose, onAddProduct, editingProduct }) => {
    const [productName, setProductName] = useState('');
    const [productImages, setProductImages] = useState([]);
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [sizes, setSizes] = useState({ XS: 0, S: 0, M: 0, L: 0 });  // עדכון כאן להוסיף XS
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        if (editingProduct) {
            setProductName(editingProduct.name);
            setProductDescription(editingProduct.description);
            setProductPrice(editingProduct.price);
            setPreviewImages(editingProduct.images);
            if (editingProduct.sizes) {
                setSizes(editingProduct.sizes);
            }
        }
    }, [editingProduct]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setProductImages(files);
        const imagePreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(imagePreviews);
    };

    const handleSizeChange = (size, value) => {
        setSizes(prevSizes => ({
            ...prevSizes,
            [size]: parseInt(value) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (productName && productImages.length > 0 && productDescription && productPrice) {
            const formData = new FormData();
            formData.append('name', productName);
            formData.append('description', productDescription);
            formData.append('price', productPrice);
            formData.append('sizes', JSON.stringify(Object.entries(sizes).map(([size, quantity]) => ({ size, quantity }))));
            productImages.forEach(image => {
                formData.append('images', image);
            });

            console.log('Sending sizes:', sizes); // Debugging line

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(`${process.env.REACT_APP_SERVER}/api/products`, formData, {
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
                setSizes({ XS: 0, S: 0, M: 0, L: 0 }); // Reset sizes with XS
                setPreviewImages([]);
            } catch (error) {
                console.error('Error uploading product:', error);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{editingProduct ? 'ערוך מוצר' : 'העלה מוצר חדש'}</DialogTitle>
            <DialogContent>
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
                    <Box marginTop="20px">
                        <h4>ניהול מידות ומלאי</h4>
                        <TextField
                            variant="outlined"
                            label="כמות במלאי - מידה XS"
                            type="number"
                            value={sizes.XS}
                            onChange={(e) => handleSizeChange('XS', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            variant="outlined"
                            label="כמות במלאי - מידה S"
                            type="number"
                            value={sizes.S}
                            onChange={(e) => handleSizeChange('S', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            variant="outlined"
                            label="כמות במלאי - מידה M"
                            type="number"
                            value={sizes.M}
                            onChange={(e) => handleSizeChange('M', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            variant="outlined"
                            label="כמות במלאי - מידה L"
                            type="number"
                            value={sizes.L}
                            onChange={(e) => handleSizeChange('L', e.target.value)}
                            margin="normal"
                        />
                    </Box>
                    <DialogActions>
                        <Button onClick={onClose} color="secondary">בטל</Button>
                        <Button type="submit" color="primary">{editingProduct ? 'שמור שינויים' : 'הוסף מוצר'}</Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UploadProductModal;