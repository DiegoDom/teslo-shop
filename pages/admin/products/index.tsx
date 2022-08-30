import NextLink from 'next/link';
import useSWR from 'swr';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';

import { Loader } from '../../../components/ui';
import { IProduct } from '../../../interfaces';
import { currency } from '../../../utils';
import { AdminLayout } from '../../../components/layouts';

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a
          href={`/product/${row.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          <CardMedia
            className="fadeIn"
            component="img"
            sx={{
              transition: 'all 0.3s ease',
            }}
            image={`${row.img}`}
            alt={row.title}
          />
        </a>
      );
    }
  },
  {
    field: 'title',
    headerName: 'Titulo',
    width: 200,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref>
          <Link underline='always'>{row.title}</Link>
        </NextLink>
      );
    }
  },
  { field: 'gender', headerName: 'Género' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!error && !data) {
    return <Loader />;
  }

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: currency.format(product.price),
    sizes: product.sizes.join(', '),
    slug: product.slug
  }));

  return (
    <AdminLayout
      title="Administración de productos"
      subTitle="Mantenimiento de productos"
      icon={<CategoryOutlined />}
    >
      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button startIcon={<AddOutlined />} color="secondary" href="/admin/products/new">
          Crear producto
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ my: 2, height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
