import { FC, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { CartContext } from '../../context/cart/CartContext';

import { currency } from '../../utils';

interface Props {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  };
}

export const OrderSumary: FC<Props> = ({ orderValues }) => {
  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

  const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, tax, total };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Total de artículos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>
          {summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'productos' : 'producto'}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(summaryValues.subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100}%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(summaryValues.tax)} </Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Total
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {currency.format(summaryValues.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
