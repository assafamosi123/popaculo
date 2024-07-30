import React from 'react';
import ProductItem from './ProductItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const ProductList = ({ products, onDelete, onEdit, onAddToCart }) => {
    return (
        <Box mt={4}>
            <Grid container spacing={2}>
                {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <ProductItem
                            product={product}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onAddToCart={onAddToCart}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProductList;