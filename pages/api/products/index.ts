import type { NextApiRequest, NextApiResponse } from 'next';
import { db, SHOP_CONSTANTS } from '../../../database';
import { IProduct } from '../../../interfaces';
import Product from '../../../models/Product';

type Data = IProduct[] | { success: boolean; error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { gender = 'all' } = req.query;

    let condition = {};

    if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
      condition = { gender };
    }

    await db.connect();
    const products = await Product.find(condition)
      .select('title images price inStock slug -_id')
      .lean()
      .sort({ createdAt: 'ascending' });
    await db.disconnect();

    const updatedProducts = products.map(product => {
      product.images = product.images.map(image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
      });

      return product;
    });

    res.status(200).json(updatedProducts);
  } catch (error) {
    await db.disconnect();
    console.log(error);
    res.status(500).json([]);
  }
};
