import { GetServerSideProps, NextPage } from 'next';
import {
  ConfirmationNumberOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined
} from '@mui/icons-material';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography
} from '@mui/material';

import { AdminLayout } from '../../../components/layouts';
import { IOrder } from '../../../interfaces';
import { dbOrders } from '../../../database';
import { CartList, OrderSumary } from '../../../components/cart';

interface Props {
  order: IOrder;
}

const AdminOrderPage: NextPage<Props> = ({ order }) => {
  const {
    _id,
    isPaid,
    orderItems,
    shippingAddress,
    numberOfItems,
    subTotal,
    tax,
    total
  } = order;

  return (
    <AdminLayout
      title='Resumen de orden'
      subTitle={`Resumen de compra de la orden ${_id}`}
      icon={<ConfirmationNumberOutlined />}
    >
      {isPaid ? (
        <Chip
          label='Orden pagada'
          color='success'
          variant='outlined'
          icon={<CreditScoreOutlined />}
          sx={{ my: 2, fontSize: 18 }}
        />
      ) : (
        <Chip
          label='Pendiente de pago'
          color='error'
          variant='outlined'
          icon={<CreditCardOffOutlined />}
          sx={{ my: 2, fontSize: 18 }}
        />
      )}

      <Grid container spacing={4} className='fadeIn'>
        <Grid item xs={12} md={7}>
          <CartList products={orderItems} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2' component='h2'>
                Resumen ({numberOfItems}{' '}
                {numberOfItems === 1 ? 'producto' : 'productos'})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>
                  Dirección de entrega
                </Typography>
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
                  total: total
                }}
              />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Box
                  className='fadeIn'
                  sx={{ display: 'flex', flex: 1 }}
                  flexDirection='column'
                >
                  {isPaid ? (
                    <Chip
                      label='Orden pagada'
                      color='success'
                      variant='outlined'
                      icon={<CreditScoreOutlined />}
                      sx={{ my: 2, fontSize: 18 }}
                    />
                  ) : (
                    <Chip
                      label='Pendiente de pago'
                      color='error'
                      variant='outlined'
                      icon={<CreditCardOffOutlined />}
                      sx={{ my: 2, fontSize: 18 }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query
}) => {
  const { id = '' } = query;

  const order = await dbOrders.getOrderByID(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders',
        permanent: false
      }
    };
  }

  order.orderItems = order.orderItems.map(product => {
    product.image = product.image.includes('http')
      ? product.image
      : `${process.env.HOST_NAME}/products/${product.image}`;
    return product;
  });

  return {
    props: {
      order
    }
  };
};

export default AdminOrderPage;
