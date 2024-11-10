import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontStyle, setFontStyle] = useState('normal');

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const updateFontStyle = (style) => setFontStyle(style);

  const globalStyles = {
    text: {
      fontFamily: fontStyle,
      color: isDarkMode ? '#fff' : '#000',
    },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, fontStyle, updateFontStyle, globalStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
