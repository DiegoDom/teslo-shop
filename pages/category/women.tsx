import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products';

import { Loader } from '../../components/ui';
import { useProducts } from '../../hooks/useProducts';
import { IProduct } from '../../interfaces';

const WomenPage: NextPage = () => {
  const { products, isLoading } = useProducts<IProduct[]>(
    '/products?gender=women'
  );

  return (
    <ShopLayout
      title={'Teslo-Shop - Mujeres'}
      pageDescription={'Teslo shop ropa y accesorios para mujer'}
    >
      <Typography variant="h1" component={'h1'}>
        Mujer
      </Typography>
      <Typography
        variant="h2"
        sx={{
          mb: 1,
        }}
      >
        Todos los productos para mujer
      </Typography>
      {isLoading ? <Loader /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
