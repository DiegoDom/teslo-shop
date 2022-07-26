import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products';

import { Loader } from '../../components/ui';
import { useProducts } from '../../hooks/useProducts';

const MenPage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout
      title={'Teslo-Shop - Hombres'}
      pageDescription={'Teslo shop ropa y accesorios para hombre'}
    >
      <Typography variant="h1" component={'h1'}>
        Hombre
      </Typography>
      <Typography
        variant="h2"
        sx={{
          mb: 1,
        }}
      >
        Todos los productos para hombre
      </Typography>
      {isLoading ? <Loader /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default MenPage;
