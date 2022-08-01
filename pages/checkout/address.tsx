import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { ShopLayout } from '../../components/layouts';
import { countries } from '../../utils';
import { CartContext } from '../../context';

type FormData = {
  address: string;
  address2?: string;
  city: string;
  country: string;
  lastName: string;
  name: string;
  phone: string;
  zipCode: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    lastName: Cookies.get('lastName') || '',
    name: Cookies.get('name') || '',
    phone: Cookies.get('phone') || '',
    zipCode: Cookies.get('zipCode') || '',
  };
};

const AddressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      address: '',
      address2: '',
      city: '',
      country: countries[4].name,
      lastName: '',
      name: '',
      phone: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    reset(getAddressFromCookies());
  }, [reset]);

  const onSubmit = (data: FormData) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          Dirección
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              autoComplete="new-name"
              {...register('name', {
                required: 'Ingrese el nombre del receptor',
                minLength: { value: 2, message: 'Nombre inválido' },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              autoComplete="new-lastname"
              {...register('lastName', {
                required: 'Ingrese el apellido del receptor',
                minLength: { value: 2, message: 'Nombre inválido' },
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              autoComplete="new-address"
              {...register('address', {
                required: 'Ingrese su dirección',
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Dirección 2 (opcional)" variant="filled" fullWidth autoComplete="new-address" {...register('address2')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código postal"
              variant="filled"
              fullWidth
              autoComplete="new-address"
              {...register('zipCode', {
                required: 'Ingrese su código postal',
              })}
              error={!!errors.zipCode}
              helperText={errors.zipCode?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              autoComplete="new-address"
              {...register('city', {
                required: 'Ingrese el nombre de su ciudad',
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="País"
              variant="filled"
              fullWidth
              autoComplete="new-address"
              {...register('country', {
                required: 'Ingrese el nombre de su país',
              })}
              error={!!errors.country}
              helperText={errors.country?.message}
            />
            {/* <FormControl fullWidth>
              <TextField
                select
                variant="filled"
                label="País"
                defaultValue={countries[4].code}
                {...register('country', {
                  required: 'Seleccione su país',
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
              >
                {countries.map(({ code, name }) => (
                  <MenuItem key={code} value={code}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              autoComplete="new-phone"
              {...register('phone', {
                required: 'Ingrese su teléfono',
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display="flex" justifyContent="flex-end">
          <Button color="secondary" className="circular-btn" size="large" type="submit">
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
/* export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies;

  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: '/auth/login?p=/checkout/address',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}; */

export default AddressPage;
