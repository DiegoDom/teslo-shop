import { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';
import Cookies from 'js-cookie';

import { CartContext } from '../../context';
/* import { countries, jwt } from '../../utils'; */
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSumary } from '../../components/cart';

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems } = useContext(CartContext);

  useEffect(() => {
    if (!Cookies.get('name')) {
      router.push('/checkout/address');
    }
  }, [router]);

  if (!shippingAddress) {
    return <></>;
  }

  const { name, lastName, address, city, country, zipCode, phone, address2 = '' } = shippingAddress;

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de compra de la orden">
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        Resumen de la orden
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <CartList editable={false} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
                <NextLink href={`/checkout/address`} passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>
                {name} {lastName}
              </Typography>
              <Typography>{phone}</Typography>
              <Typography>{address}</Typography>
              <Typography>
                {city}, {zipCode}
              </Typography>
              {/* <Typography>{countries.find((c) => c.code === country)?.name}</Typography> */}
              <Typography>{country}</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="flex-end" sx={{ mb: 1 }}>
                <NextLink href={`/cart`} passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSumary />
              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirmar orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
/* export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies;

  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: '/auth/login?p=/checkout/address',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}; */

export default SummaryPage;
