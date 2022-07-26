import { Grid, Typography } from '@mui/material';

export const OrderSumary = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Total de artículos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{`${3}.00`} </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{`$${350}.00`} </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos (16%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{`$${56}.00`} </Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Total
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {`$${356}.00`}{' '}
        </Typography>
      </Grid>
    </Grid>
  );
};
