import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';

const ASCIIContainer = styled.div`
  font-family: monospace;
  white-space: pre;
  line-height: 1.2;
  font-size: 12px;
  color: var(--primary-color);
  margin-right: 12px;
  transition: color 0.3s ease;
  user-select: none;
`;

const ASCIICatLogo = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const { isDarkTheme } = useContext(ThemeContext);
  
  const frames = [
    ` /\\_/\\  \n( o.o ) \n > ^ <  `,
    ` /\\_/\\  \n( o.o ) \n >  ~<  `,
    ` /\\_/\\  \n( o.o ) \n >   >  `,
    ` /\\_/\\  \n( o.o ) \n > ~ >  `,
    ` /\\_/\\  \n( o.o ) \n  ~  >  `
  ];

  useEffect(() => {
    // Cycle through frames every 500ms
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);
    }, 500);
    
    return () => clearInterval(interval);
  }, [frames.length]);

  return (
    <ASCIIContainer>
      {frames[frameIndex]}
    </ASCIIContainer>
  );
};

export default ASCIICatLogo; 