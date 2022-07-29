import { createContext } from 'react';
import { IUser } from '../../interfaces';

export interface AuthContextProps {
  isLoggedIn: boolean;
  user?: IUser;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    hasError: boolean;
    message?: string;
  }>;
}

export const AuthContext = createContext({} as AuthContextProps);
