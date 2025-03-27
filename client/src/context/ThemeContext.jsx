import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Check if user has a preference stored in localStorage
    const savedTheme = localStorage.getItem('darkTheme');
    
    // If there's a saved preference, use it
    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }
    
    // Otherwise, check for system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme when isDarkTheme changes
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Save to localStorage
    localStorage.setItem('darkTheme', JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  // Toggle function
  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 