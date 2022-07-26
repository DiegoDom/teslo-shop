import { FC } from 'react';
import NextLink from 'next/link';
import {
  CardActionArea,
  Grid,
  Link,
  Typography,
  CardMedia,
  Box,
  Button,
} from '@mui/material';
import { initialData } from '../../database/products';
import { ItemCounter } from '../ui';

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {
  return (
    <>
      {productsInCart.map((product) => (
        <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
          <Grid item xs={3}>
            {/* TODO: Llevar a la página del producto */}
            <NextLink href={`/product/slug`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    className="fadeIn"
                    component="img"
                    sx={{
                      transition: 'all 0.3s ease',
                      borderRadius: '5px',
                    }}
                    image={`/products/${product.images[0]}`}
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
                Talla: <strong>{product.sizes[0]}</strong>
              </Typography>
              {/* Condicional */}
              {editable ? (
                <ItemCounter />
              ) : (
                <Typography variant="h5">3 unidades</Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight={500}>
              {`$${product.price}.00`}{' '}
            </Typography>
            {editable && (
              <Button variant="text" color="secondary">
                Eliminar
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
