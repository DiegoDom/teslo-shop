import { FC, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { IProduct } from '../../interfaces';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Grid,
  Link,
  Typography
} from '@mui/material';
import { currency } from '../../utils';

interface Props {
  product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0];
  }, [isHovered, product.images]);

  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
          <Link>
            <CardActionArea>
              {product.inStock <= 0 && (
                <Chip
                  color='primary'
                  label='Producto no disponible'
                  sx={{
                    position: 'absolute',
                    zIndex: 9,
                    bottom: '10px',
                    right: '10px',
                    opacity: 0.7
                  }}
                />
              )}
              <CardMedia
                className='fadeIn'
                component='img'
                sx={{
                  transition: 'all 0.3s ease'
                }}
                image={productImage}
                alt={product.title}
                onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      <Box
        sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }}
        className='fadeIn'
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>
          {currency.format(product.price)}
        </Typography>
      </Box>
    </Grid>
  );
};
