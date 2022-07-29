import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
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
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onRegisterUser = async ({ name, email, password }: FormData) => {
    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      setErrorMessage(message!);
      return;
    }

    const destination = router.query.p?.toString() || '/';
    router.replace(destination);
  };

  return (
    <AuthLayout title="Crear cuenta">
      <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
        <Box
          sx={{ width: 450, padding: '30px 20px', borderRadius: 3 }}
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
                Crear cuenta
              </Typography>
              {showError && (
                <Chip
                  label={errorMessage}
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
                label="Nombre completo"
                variant="filled"
                fullWidth
                {...register('name', {
                  required: 'Ingrese su nombre',
                  minLength: { value: 2, message: 'Nombre inválido' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo electrónico"
                variant="filled"
                autoComplete="new-email"
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
                label="Contraseña"
                type="password"
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
                Registrarme
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <NextLink
                passHref
                href={
                  router.query.p
                    ? `/auth/login?p=${router.query.p.toString()}`
                    : '/auth/login'
                }
              >
                <Link underline="always">
                  ¿Ya tienes cuenta? Iniciar sesión
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
