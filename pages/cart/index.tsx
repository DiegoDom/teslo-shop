import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Button,
} from '@mui/material';

import { CartContext } from '../../context';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSumary } from '../../components/cart';
import { Loader } from '../../components/ui';

const CartPage = () => {
  const router = useRouter();
  const { isLoaded, numberOfItems } = useContext(CartContext);

  useEffect(() => {
    if (isLoaded && numberOfItems === 0) {
      router.replace('/cart/empty');
    }
  }, [isLoaded, numberOfItems, router]);

  if (!isLoaded || numberOfItems === 0) {
    return <Loader />;
  }

  return (
    <ShopLayout
      title={`Carrito | ${numberOfItems}`}
      pageDescription="Carrito de compras de la tienda"
    >
      <Typography variant="h1" component="h1">
        Carrito
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                Orden
              </Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSumary />
              <Box sx={{ mt: 3 }}>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  href="/checkout/address"
                >
                  Revisar orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
