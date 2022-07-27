import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products';

import { Loader } from '../../components/ui';
import { useProducts } from '../../hooks/useProducts';
import { IProduct } from '../../interfaces';

const KidsPage: NextPage = () => {
  const { products, isLoading } = useProducts<IProduct[]>(
    '/products?gender=kid'
  );

  return (
    <ShopLayout
      title={'Teslo-Shop - Niños'}
      pageDescription={'Teslo shop ropa y accesorios para niños'}
    >
      <Typography variant="h1" component={'h1'}>
        Niños
      </Typography>
      <Typography
        variant="h2"
        sx={{
          mb: 1,
        }}
      >
        Todos los productos para niños
      </Typography>
      {isLoading ? <Loader /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidsPage;
