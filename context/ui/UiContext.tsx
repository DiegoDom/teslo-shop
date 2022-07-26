import { createContext } from 'react';

export interface ContextProps {
  isMenuOpen: boolean;

  // Methods
  toggleSideMenu: () => void;
}

export const UiContext = createContext({} as ContextProps);
