import { CartState } from './';
import { ICartProduct, ShippingAddress } from '../../interfaces';

type CartActionType =
  | {
      type: '[Cart] - Load cart from Cookies | Storage';
      payload: ICartProduct[];
    }
  | { type: '[Cart] - Update products in cart'; payload: ICartProduct[] }
  | { type: '[Cart] - Change product in cart quantity'; payload: ICartProduct }
  | { type: '[Cart] - Remove product in cart'; payload: ICartProduct }
  | {
      type: '[Cart] - Update order summary';
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    }
  | {
      type: '[Cart] - Load address from Cookies | Storage';
      payload: ShippingAddress;
    }
  | {
      type: '[Cart] - Update address';
      payload: ShippingAddress;
    }
  | { type: '[Cart] - Order complete' };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case '[Cart] - Load cart from Cookies | Storage':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case '[Cart] - Update products in cart':
      return {
        ...state,
        cart: [...action.payload],
      };
    case '[Cart] - Change product in cart quantity':
      return {
        ...state,
        cart: state.cart.map((p) => {
          if (p._id !== action.payload._id) return p;
          if (p.size !== action.payload.size) return p;
          return action.payload;
        }),
      };
    case '[Cart] - Remove product in cart':
      return {
        ...state,
        cart: state.cart.filter((p) => !(p._id === action.payload._id && p.size === action.payload.size)),
      };
    case '[Cart] - Update order summary':
      return {
        ...state,
        ...action.payload,
      };
    case '[Cart] - Update address':
    case '[Cart] - Load address from Cookies | Storage':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case '[Cart] - Order complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };
    default:
      return state;
  }
};
