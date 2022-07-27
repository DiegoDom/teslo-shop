import type { NextPage, GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products';

import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
  products: IProduct[];
  query: string;
  foundProducts: boolean;
}

const SearchPage: NextPage<Props> = ({ products, query, foundProducts }) => {
  return (
    <ShopLayout
      title={'Teslo-Shop - Buscar'}
      pageDescription={'Encuentra los mejores producto de Teslo aqui'}
    >
      <Typography variant="h1" component={'h1'}>
        Buscar producto
      </Typography>
      {foundProducts ? (
        <Typography
          variant="h2"
          sx={{
            mb: 1,
            textTransform: 'capitalize',
          }}
        >
          {query}
        </Typography>
      ) : (
        <Box display="flex" gap={1}>
          <Typography
            variant="h2"
            sx={{
              mb: 1,
            }}
          >
            No contamos con productos con este término de busqueda
          </Typography>
          <Typography
            variant="h2"
            color="secondary"
            sx={{
              mb: 1,
              textTransform: 'capitalize',
            }}
          >
            {query}
          </Typography>
        </Box>
      )}
      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query } = params as { query: string };

  if (query.trim().length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);

  const foundProducts = products.length > 0;

  if (!foundProducts) {
    // TODO: retornar otros productos
    // products = await dbProducts.getAllProducts();
    products = await dbProducts.getProductsByTerm('shirts');
  }

  return {
    props: {
      products,
      query,
      foundProducts,
    },
  };
};

export default SearchPage;
