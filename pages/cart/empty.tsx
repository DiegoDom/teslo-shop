import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { ShopLayout } from '../../components/layouts';

const emptyPage = () => {
  return (
    <ShopLayout
      title="Carrito vacío"
      pageDescription="No has agregado artículos al carrito de compras"
    >
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'calc(100vh - 200px)'}
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Box display={'flex'} flexDirection="column" alignItems={'center'}>
          <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
          <Typography>Su carrito está vació</Typography>
          <NextLink href={'/'} passHref>
            <Link typography={'h4'} color="secondary">
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default emptyPage;
