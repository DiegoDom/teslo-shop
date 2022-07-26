import NextLink from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { CartList, OrderSumary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';

const OrderPage = () => {
  return (
    <ShopLayout
      title="Resumen de orden AAA"
      pageDescription="Resumen de compra de la orden AAA"
    >
      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        Orden: AAA
      </Typography>
      {/* <Chip
        label="Pendiente de pago"
        color="error"
        variant="outlined"
        icon={<CreditCardOffOutlined />}
        sx={{ my: 2, fontSize: 18 }}
      /> */}
      <Chip
        label="Orden pagada"
        color="success"
        variant="outlined"
        icon={<CreditScoreOutlined />}
        sx={{ my: 2, fontSize: 18 }}
      />
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
                {/* TODO: Procesar pago */}
                <Chip
                  label="Orden pagada"
                  color="success"
                  variant="outlined"
                  icon={<CreditScoreOutlined />}
                  sx={{ my: 2, fontSize: 18 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
