import { isValidObjectId } from 'mongoose';
import { db } from './';
import { Order } from '../models';
import { IOrder } from '../interfaces';

export const getOrderByID = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) {
    return null;
  }

  try {
    await db.connect();
    const order = await Order.findById(id).lean();
    await db.disconnect();

    if (!order) {
      return null;
    }

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return null;
  }
};

//

export const getOrdersByUser = async (userID: string): Promise<IOrder[]> => {
  if (!isValidObjectId(userID)) {
    return [];
  }

  try {
    await db.connect();
    const orders = await Order.find({ user: userID }).lean().sort({ createdAt: 'descending' });
    await db.disconnect();

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return [];
  }
};
