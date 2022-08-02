import { FC, useEffect, useReducer } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import axios from 'axios';

import { AuthContext, authReducer } from './';

import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
    }
  }, [status, data]);

  /* useEffect(() => {
    renovarSesion();
  }, []); */

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/auth/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);

      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post('/auth/register', {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set('token', token);

      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false,
        message: 'Usuario creado con éxito',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data as {
          error: string;
        };
        return {
          hasError: true,
          message: errors.error,
        };
      }
      return {
        hasError: true,
        message: 'No fue posible crear el usuario',
      };
    }
  };

  const renovarSesion = async () => {
    if (!Cookies.get('token')) return;

    try {
      const { data } = await tesloApi.get('/auth/renew');
      const { token, user } = data;

      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
    } catch (error) {
      console.log(error);
      Cookies.remove('token');
    }
  };

  const logout = () => {
    Cookies.remove('cart');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('lastName');
    Cookies.remove('name');
    Cookies.remove('phone');
    Cookies.remove('zipCode');
    signOut();
    // Cookies.remove('token');
    // router.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
