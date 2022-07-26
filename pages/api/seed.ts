import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDatabase } from '../../database';

import { Product } from '../../models';

type Data = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({
      success: false,
      message: 'Este endpoint es solo para desarrollo',
    });
  }

  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(seedDatabase.initialData.products);

  await db.disconnect();

  res.status(200).json({
    success: true,
    message: 'Proceso del seed realizado correctamente',
  });
}