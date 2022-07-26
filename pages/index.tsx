import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../components/layouts/ShopLayout';
import { ProductList } from '../components/products';

import { Loader } from '../components/ui';
import { useProducts } from '../hooks/useProducts';

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout
      title={'Teslo-Shop - Home'}
      pageDescription={'Encuentra los mejores producto de Teslo aqui'}
    >
      <Typography variant="h1" component={'h1'}>
        Tienda
      </Typography>
      <Typography
        variant="h2"
        sx={{
          mb: 1,
        }}
      >
        Todos los productos
      </Typography>
      {isLoading ? <Loader /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
