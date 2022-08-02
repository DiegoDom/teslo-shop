import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { CardActionArea, Grid, Link, Typography, CardMedia, Box, Button } from '@mui/material';

import { CartContext } from '../../context';

import { ItemCounter } from '../ui';
import { ICartProduct, IOrderItem } from '../../interfaces';
import { currency } from '../../utils';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

  const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
    product.quantity = newQuantityValue;

    updateCartQuantity(product);
  };

  const productsToShow = products ? products : cart;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
          <Grid item xs={3}>
            {/* TODO: Llevar a la página del producto */}
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    className="fadeIn"
                    component="img"
                    sx={{
                      transition: 'all 0.3s ease',
                      borderRadius: '5px',
                    }}
                    image={`/products/${product.image}`}
                    alt={product.title}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
              </Typography>
              {/* Condicional */}
              {editable ? (
                <ItemCounter currentValue={product.quantity} maxValue={10} updatedQuantity={(value) => onNewCartQuantityValue(product as ICartProduct, value)} />
              ) : (
                <Typography variant="h5">
                  {product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={2} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="subtitle1" fontWeight={500}>
              {currency.format(product.price)}
            </Typography>
            {editable && (
              <Button variant="text" color="secondary" onClick={() => removeCartProduct(product as ICartProduct)}>
                Eliminar
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
