import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { CartList, OrderSumary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

const SummaryPage = () => {
  return (
    <ShopLayout
      title="Resumen de orden"
      pageDescription="Resumen de compra de la orden"
    >
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
                Resumen (3 productos)
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href={`/checkout/address`} passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>Diego Dominguez</Typography>
              <Typography>Conocido #344</Typography>
              <Typography>Zapopan, Jalisco</Typography>
              <Typography>México, 45128</Typography>
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

export default SummaryPage;
