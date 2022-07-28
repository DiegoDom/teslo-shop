import { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { CartContext } from '../../context/cart/CartContext';

import { currency } from '../../utils';

export const OrderSumary = () => {
  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Total de artículos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>
          {numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100}%)
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(tax)} </Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Total
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {currency.format(total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
