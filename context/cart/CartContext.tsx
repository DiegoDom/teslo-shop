import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';

export interface CartContextProps {
  cart: ICartProduct[];
  isLoaded: boolean;
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;

  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void;
  createOrder: () => Promise<{ success: boolean; data: string }>;
}

export const CartContext = createContext({} as CartContextProps);
