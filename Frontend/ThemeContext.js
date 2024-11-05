// src/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontStyle, setFontStyle] = useState('normal'); // Default font style

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const updateFontStyle = (newFontStyle) => {
    setFontStyle(newFontStyle);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, fontStyle, updateFontStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};
