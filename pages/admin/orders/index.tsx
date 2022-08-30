import useSWR from 'swr';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ConfirmationNumberOutlined } from '@mui/icons-material';

import { Loader } from '../../../components/ui';
import { IOrder, IUser } from '../../../interfaces';
import { currency } from '../../../utils';
import { AdminLayout } from '../../../components/layouts';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 220 },
  { field: 'email', headerName: 'Correo electrónico', width: 200 },
  { field: 'name', headerName: 'Nombre completo', width: 200 },
  { field: 'total', headerName: 'Monto total', width: 120 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
  },
  {
    field: 'noProducts',
    headerName: 'No° productos',
    headerAlign: 'center',
    width: 120,
    align: 'center',
  },
  {
    field: 'check',
    headerName: 'Detalles',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver detalles
        </a>
      );
    },
  },
  { field: 'createdAt', headerName: 'Fecha', width: 250 },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!error && !data) {
    return <Loader />;
  }

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: currency.format(order.total),
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title="Administración de ordenes"
      subTitle="Mantenimiento de ordenes"
      icon={<ConfirmationNumberOutlined />}
    >
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

export default OrdersPage;
