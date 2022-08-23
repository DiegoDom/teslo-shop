import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Grid, Typography } from '@mui/material';
import {
  AttachmentOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  CreditCardOffOutlined,
  GroupOutlined,
  CategoryOutlined,
  CancelPresentationOutlined,
  ProductionQuantityLimitsOutlined,
  AccessTimeOutlined,
} from '@mui/icons-material';

import { AdminLayout } from '../../components/layouts';
import { SummaryTitle } from '../../components/admin/SummaryTitle';
import { DashboardSummaryResponse } from '../../interfaces';
import { Loader } from '../../components/ui';

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    '/api/admin/dashboard',
    {
      refreshInterval: 30 * 1000, // 30 seg
    },
  );

  const [refreshIn, setRefreshIn] = useState(30);


  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }

  if (data!.message) {
    return <Typography sx={{ m: 3}} color="error" variant='h1' component="h1">{data?.message}</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithLowInventory,
    productsWithNoInventory,
  } = data!;

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="General Statistics"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTitle
          title={numberOfOrders}
          subTitle="Orders"
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={paidOrders}
          subTitle="Paid Orders"
          icon={<AttachmentOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={notPaidOrders}
          subTitle="Pending Orders"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={numberOfClients}
          subTitle="Clients"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={numberOfProducts}
          subTitle="Products"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={productsWithNoInventory}
          subTitle="Out of Stock"
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          title={productsWithLowInventory}
          subTitle="Low Stock"
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />
        <SummaryTitle
          title={refreshIn}
          subTitle="Updating in"
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
