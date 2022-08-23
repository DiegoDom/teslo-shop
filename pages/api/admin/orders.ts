import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import Order from '../../../models/Order'

type Data = { success: boolean; error: string } | IOrder[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  switch (req.method) {
    case 'GET':
      return getOrders(req, res)
    default:
      return res.status(400).json({
        error: 'El método enviado no es soportado...',
        success: false,
      })
  }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect()

    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: 'descending' })
      .lean()

    await db.disconnect()

    return res.status(200).json(orders)
  } catch (error) {
    await db.disconnect()
    console.log(error)
    return res.status(500).json({
      error: 'Lo sentimos ocurrio un error inesperado...',
      success: false,
    })
  }
}
