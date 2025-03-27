import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  font-family: monospace;
  white-space: pre;
  line-height: 1.2;
  font-size: 14px;
  color: var(--primary-color);
  margin: 0 auto;
  text-align: center;
  transition: color 0.3s ease;
  user-select: none;
`;

const ASCIICatLoader = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  
  // Improved cat running/walking animation frames where the whole cat moves together
  const frames = [
    `
    /\\_/\\   
   ( o.o )  
  /(>   >)~ 
   ^~^~^~   
    `,
    `
     /\\_/\\  
    ( o.o )~ 
   /(>   >)  
    ~^~^~^   
    `,
    `
      /\\_/\\ 
     ( o.o ) 
    /(>   >)~
     ~^~^~^  
    `,
    `
     /\\_/\\  
    ( o.o )~ 
   /(>   >)  
    ^~^~^~   
    `,
    `
    /\\_/\\   
   ( o.o )  
  /(>   >)~ 
   ~^~^~^   
    `
  ];

  useEffect(() => {
    // Cycle through frames every 250ms for a smoother animation
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);
    }, 250);
    
    return () => clearInterval(interval);
  }, [frames.length]);

  return (
    <LoaderContainer>
      {frames[frameIndex]}
    </LoaderContainer>
  );
};

export default ASCIICatLoader; 