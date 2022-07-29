import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../../models';
import { db } from '../../../../database';
import { IProduct } from '../../../../interfaces';

type Data = IProduct | { success: boolean; error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(req, res);
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      });
  }
}

const getProductBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { slug } = req.query;

  try {
    await db.connect();

    const product = await Product.findOne({
      slug,
    });

    await db.disconnect();

    if (!product) {
      return res.status(400).json({
        error: 'La entrada solicitada no existe en la base de datos...',
        success: false,
      });
    }

    res.status(200).json(product);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      error: 'Lo sentimos ocurrio un error inesperado en el servidor',
      success: false,
    });
  }
};
