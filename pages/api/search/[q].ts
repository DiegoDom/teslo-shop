import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../models';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';

type Data = IProduct[] | { success: boolean; error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return searchProducts(req, res);
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      });
  }
}

const searchProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { q = '' } = req.query;

  if (q.length === 0) {
    return res.status(400).json({
      error: 'Debe especificar el argumento de busqueda...',
      success: false,
    });
  }

  q = q.toString().toLocaleLowerCase();

  try {
    await db.connect();

    const products = await Product.find({
      $text: { $search: q },
    })
      .select('title images price inStock slug -_id')
      .lean()
      .sort({ createdAt: 'ascending' });

    await db.disconnect();

    res.status(200).json(products);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      error:
        error.errors.status.message ||
        'Lo sentimos ocurrio un error inesperado en el servidor',
      success: false,
    });
  }
};
