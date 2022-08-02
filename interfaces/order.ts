import { IUser, ISize } from './';

export interface IOrder {
  _id?: string;
  user?: IUser | string;
  orderItems: IOrderItem[];
  shippingAddress: ShippingAddress;

  paymentResult?: string;
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  isPaid: boolean;
  paidAt?: string;
  transactionId?: string;
}

export interface IOrderItem {
  _id: string;
  image: string;
  price: number;
  quantity: number;
  size: ISize;
  slug: string;
  title: string;
  gender: string;
}

export interface ShippingAddress {
  address: string;
  address2?: string;
  city: string;
  country: string;
  lastName: string;
  name: string;
  phone: string;
  zipCode: string;
}
