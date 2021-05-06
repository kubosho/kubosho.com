import React, { createContext, useEffect, useState } from 'react';
import { ThemeColor } from './theme_color';

type Props = {
  children: React.ReactNode;
};

const ThemeContext = createContext({ colorMode: ThemeColor.Light, setColorMode: null });

export const ThemeProvider = ({ children }: Props): JSX.Element => {
  const [colorMode, setColorMode] = useState(undefined);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue('--initial-theme-color');
    setColorMode(initialColorValue);
  }, []);

  const saveColorMode = (value: string): void => {
    setColorMode(value);
    window.localStorage.setItem('theme-color', value);
  };

  return <ThemeContext.Provider value={{ colorMode, setColorMode: saveColorMode }}>{children}</ThemeContext.Provider>;
};
