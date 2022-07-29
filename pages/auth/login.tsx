import { useState, useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { ErrorOutline } from '@mui/icons-material';

import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);

  const onLoginUser = async ({ email, password }: FormData) => {
    const isValidLogin = await loginUser(email, password);

    if (!isValidLogin) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // TODO: Navegar a la pantalla donde el usuario estaba
    router.replace('/');
  };

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
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
              {showError && (
                <Chip
                  label="Correo o contraseña no válidos..."
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                  sx={{
                    my: 2,
                    width: '100%',
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo electrónico"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: 'Ingrese su correo electrónico',
                  validate: (val) => validations.isEmail(val),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Contraseña"
                variant="filled"
                fullWidth
                {...register('password', {
                  required: 'Ingrese su contraseña',
                  minLength: { value: 6, message: 'Contraseña inválida' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                disabled={showError}
              >
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <NextLink href="/auth/register" passHref>
                <Link underline="always">
                  ¿Aún no tienes cuenta? registrate
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
