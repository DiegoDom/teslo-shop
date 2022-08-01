import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  //const { loginUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);

  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    /* const isValidLogin = await loginUser(email, password);

    if (!isValidLogin) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const destination = router.query.p?.toString() || '/';
    router.replace(destination); */

    await signIn('credentials', { email, password });
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
            <Link display={'flex'} alignItems={'center'} justifyContent="center" sx={{ mb: 2 }}>
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
                autoComplete="new-email"
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
              <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth disabled={showError}>
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <NextLink href={router.query.p ? `/auth/register?p=${router.query.p.toString()}` : '/auth/register'} passHref>
                <Link underline="always">¿Aún no tienes cuenta? registrate</Link>
              </NextLink>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" flexDirection="column">
              <Divider sx={{ mb: 2, width: '100%' }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials') return <div key="credentials"></div>;
                return (
                  <Button key={provider.id} variant="outlined" fullWidth color="primary" sx={{ mb: 1 }} onClick={() => signIn(provider.id)}>
                    {provider.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  const { p = '/' } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
