import { FC, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';

import { CartContext, cartReducer } from './';
import { ICartProduct, ShippingAddress, IOrder } from '../../interfaces';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
  cart: ICartProduct[];
  isLoaded: boolean;
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  isLoaded: false,
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cartCookies = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [];

      dispatch({
        type: '[Cart] - Load cart from Cookies | Storage',
        payload: cartCookies,
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - Load cart from Cookies | Storage',
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (Cookies.get('name')) {
      const addressCookies = {
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        lastName: Cookies.get('lastName') || '',
        name: Cookies.get('name') || '',
        phone: Cookies.get('phone') || '',
        zipCode: Cookies.get('zipCode') || '',
      };

      dispatch({
        type: '[Cart] - Load address from Cookies | Storage',
        payload: addressCookies,
      });
    }
  }, []);

  useEffect(() => {
    Cookies.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);

    const subTotal = state.cart.reduce((prev, current) => current.quantity * current.price + prev, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    };

    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    //! Nivel 1
    // dispatch({ type: '[Cart] - Add product', payload: product });

    //! Nivel 2
    /* const productsInCart = state.cart.filter(
      (p) => p._id === product._id && p.size !== product.size
    );
    dispatch({
      type: '[Cart] - Update products in cart',
      payload: [...productsInCart, product],
    }); */

    //! Nivel FINAL
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart) {
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product],
      });
    }

    const productInCartButDifferentSize = state.cart.some((p) => p._id === product._id && p.size === product.size);
    if (!productInCartButDifferentSize) {
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product],
      });
    }

    // Acumular
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;

      if (p.size !== product.size) return p;

      // Actualizar la cantidad
      p.quantity += product.quantity;

      return p;
    });

    dispatch({
      type: '[Cart] - Update products in cart',
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Change product in cart quantity',
      payload: product,
    });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Remove product in cart',
      payload: product,
    });
  };

  const updateAddress = (address: ShippingAddress) => {
    Cookies.set('address', address.address);
    Cookies.set('address2', address.address2 || '');
    Cookies.set('city', address.city);
    Cookies.set('country', address.country);
    Cookies.set('lastName', address.lastName);
    Cookies.set('name', address.name);
    Cookies.set('phone', address.phone);
    Cookies.set('zipCode', address.zipCode);

    dispatch({
      type: '[Cart] - Update address',
      payload: address,
    });
  };

  const createOrder = async (): Promise<{ success: boolean; data: string }> => {
    if (!state.shippingAddress) {
      throw new Error('No se ingreso la dirección de entrega');
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);

      dispatch({ type: '[Cart] - Order complete' });

      return {
        success: true,
        data: data._id!,
      };
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data as {
          error: string;
        };
        return {
          success: false,
          data: errors.error,
        };
      }
      return {
        success: false,
        data: 'Lo sentimos ocurrio un error inesperado',
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        // Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
