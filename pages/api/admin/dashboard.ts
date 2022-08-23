import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data =
  | { success: boolean; error: string; }
  | {
    notPaidOrders: number;
    numberOfClients: number;
    numberOfOrders: number;
    numberOfProducts: number;
    paidOrders: number;
    productsWithLowInventory: number;
    productsWithNoInventory: number;
  };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  try {

    await db.connect();

    const [
      numberOfOrders,
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithLowInventory,
      productsWithNoInventory,] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ isPaid: true }),
        User.countDocuments({ role: 'client' }),
        Product.countDocuments(),
        Product.countDocuments({ inStock: { $gte: 10 } }),
        Product.countDocuments({ inStock: { $lte: 1 } }),
      ]);

    await db.disconnect();

    res.status(200).json({
      numberOfOrders,
      paidOrders,
      notPaidOrders: numberOfOrders - paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithLowInventory,
      productsWithNoInventory
    });

  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      error: 'Lo sentimos ocurrio un error inesperado en el servidor',
      success: false,
    });
  }

  /* const notPaidOrders = 0;
  const numberOfClients = 0;
  const numberOfOrders = 0;
  const numberOfProducts = 0;
  const paidOrders = 0;
  const productsWithLowInventory = 0;
  const productsWithNoInventory = 0; */



}