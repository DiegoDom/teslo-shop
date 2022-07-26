import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layouts';

const LoginPage = () => {
  return (
    <AuthLayout title="Iniciar sesión">
      <Box
        sx={{
          width: 450,
          padding: '30px 20px',
          borderRadius: 3,
        }}
        className="summary-card"
      >
        <NextLink href={'/'} passHref>
          <Link
            display={'flex'}
            alignItems={'center'}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h1">
              Iniciar sesión
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Correo electrónico" variant="filled" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contraseña"
              type="password"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              className="circular-btn"
              size="large"
              fullWidth
            >
              Ingresar
            </Button>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <NextLink href="/auth/register" passHref>
              <Link underline="always">¿Aún no tienes cuenta? registrate</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
