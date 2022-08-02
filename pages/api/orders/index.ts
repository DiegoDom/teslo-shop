import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces/order';
import { Product, Order } from '../../../models';

type Data = IOrder | { success: boolean; error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  // Verificar la sesión del usuario
  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      error: 'El usuario no tiene una sesión activa...',
      success: false,
    });
  }

  // Crear un arreglo con los productos de la orden
  const productsIds = orderItems.map((p) => p._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find((p) => p.id === current._id)?.price;
      if (!currentPrice) {
        throw new Error('Verifique el carrito de nuevo, producto inexistente');
      }

      return current.quantity * currentPrice + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (taxRate + 1);

    if (total !== backendTotal) {
      throw new Error('El total no cuadra con el monto');
    }

    // Todo bien hasta este punto
    const userID = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userID });
    await newOrder.save();
    await db.disconnect();

    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    return res.status(400).json({
      error: error.message || 'Ocurrio un error inesperado!',
      success: false,
    });
  }

  // return res.status(201).json(req.body);
};
