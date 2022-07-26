import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { Box, Link, Typography } from '@mui/material';

interface Props {
  title: string;
  children: ReactNode;
}
export const AuthLayout: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height="calc(100vh - 200px)"
        >
          {children}
        </Box>
      </main>
    </>
  );
};
