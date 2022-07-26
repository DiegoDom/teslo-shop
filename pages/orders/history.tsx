import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layouts';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
  },
  {
    field: 'fullName',
    headerName: 'Nombre completo',
    width: 300,
  },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra información si la orden está pagada o no',
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="No pagada" variant="outlined" />
      );
    },
  },
  {
    field: 'redirect',
    headerName: 'Ver orden',
    description: 'Te redirecciona al detalle de la orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline="always">Ver orden</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    fullName: 'Diego Dominguez',
    paid: true,
  },
  {
    id: 2,
    fullName: 'John Doe',
    paid: false,
  },
  {
    id: 3,
    fullName: 'Sam Anderson',
    paid: false,
  },
  {
    id: 4,
    fullName: 'Julian Camarena',
    paid: true,
  },
  {
    id: 5,
    fullName: 'Diego Dominguez',
    paid: false,
  },
  {
    id: 6,
    fullName: 'Sean John',
    paid: true,
  },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        Historial de ordenes
      </Typography>
      <Grid container>
        <Grid item xs={12} sx={{ my: 2, height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default HistoryPage;
