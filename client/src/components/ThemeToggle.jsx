import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <ThemeIcon onClick={toggleTheme} title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}>
      {isDarkTheme ? (
        <Moon size={18} color="var(--primary-color)" />
      ) : (
        <Sun size={18} color="var(--primary-color)" />
      )}
    </ThemeIcon>
  );
};

export default ThemeToggle; 