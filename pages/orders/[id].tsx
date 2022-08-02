import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { PayPalButtons } from '@paypal/react-paypal-js';

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSumary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, orderItems, shippingAddress, numberOfItems, subTotal, tax, total } = order;

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de compra de la orden">
      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        Orden: {_id}
      </Typography>

      {isPaid ? <Chip label="Orden pagada" color="success" variant="outlined" icon={<CreditScoreOutlined />} sx={{ my: 2, fontSize: 18 }} /> : <Chip label="Pendiente de pago" color="error" variant="outlined" icon={<CreditCardOffOutlined />} sx={{ my: 2, fontSize: 18 }} />}

      <Grid container spacing={4} className="fadeIn">
        <Grid item xs={12} md={7}>
          <CartList products={orderItems} />
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
              </Box>

              <Typography>
                {shippingAddress.name} {shippingAddress.lastName}
              </Typography>
              <Typography>{shippingAddress.phone}</Typography>
              <Typography>{shippingAddress.address}</Typography>
              <Typography>{shippingAddress.address2}</Typography>
              <Typography> {shippingAddress.city}</Typography>
              <Typography>
                {shippingAddress.country} {shippingAddress.zipCode}
              </Typography>
              <Divider sx={{ my: 1 }} />

              <OrderSumary
                orderValues={{
                  numberOfItems: numberOfItems,
                  subTotal: subTotal,
                  tax: tax,
                  total: total,
                }}
              />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                {/* TODO: Procesar pago */}
                {isPaid ? (
                  <Chip label="Orden pagada" color="success" variant="outlined" icon={<CreditScoreOutlined />} sx={{ my: 2, fontSize: 18 }} />
                ) : (
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: `${total}`,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then((details) => {
                        console.log({ details });
                        //const name = details.payer!.name.given_name;
                        //alert(`Transaction completed by ${name}`);
                      });
                    }}
                  />
                )}
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

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderByID(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
