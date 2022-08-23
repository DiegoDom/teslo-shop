import { Card, CardContent, Grid, Typography } from '@mui/material';
import { FC } from 'react';

interface Props {
  title: string | number;
  subTitle: string;
  icon: JSX.Element;
}

export const SummaryTitle: FC<Props> = ({ title, subTitle, icon }) => {
  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card sx={{ display: 'flex' }}>
        <CardContent sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', width: 50 }}>
          {icon}
        </CardContent>
        <CardContent sx={{ display: 'flex', flex: '1 0 auto', flexDirection: 'column' }}>
          <Typography variant='h3' component='h3'>{title}</Typography>
          <Typography variant='caption' sx={{ pl: 1 }}>{subTitle}</Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
