import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ProductItem = ({ product, onDelete, onEdit, onAddToCart }) => {
    return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image={product.images[0]} // מציג את התמונה הראשונה
                alt={product.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {product.price} ₪
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={() => onEdit(product.id)}>
                    ערוך
                </Button>
                <Button size="small" color="secondary" onClick={() => onDelete(product.id)}>
                    מחק
                </Button>
                <Button size="small" color="primary" onClick={() => onAddToCart(product)}>
                    הוסף לעגלה
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductItem;