import React, { useState } from 'react';
import UploadProductModal from './UploadProductModal';
import ProductList from './ProductList';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    adminContainer: {
        marginTop: theme.spacing(4),
    },
}));

const AdminOption = () => {
    const classes = useStyles();
    const [products, setProducts] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleAddProduct = (product) => {
        setProducts([...products, { ...product, id: Date.now() }]);
    };

    const handleDeleteProduct = (productId) => {
        setProducts(products.filter(product => product.id !== productId));
    };

    const handleEditProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleAddToCart = (product) => {
        console.log('Added to cart:', product);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <Container className={classes.adminContainer}>
            <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
                הוסף מוצר חדש
            </Button>
            <ProductList
                products={products}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
                onAddToCart={handleAddToCart}
            />
            <UploadProductModal
                open={isModalOpen}
                onClose={handleModalClose}
                onAddProduct={handleAddProduct}
                editingProduct={editingProduct}
            />
        </Container>
    );
};

export default AdminOption;