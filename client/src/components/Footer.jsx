import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--secondary-color);
  padding: 2rem 0;
  margin-top: 3rem;
  font-size: 0.9rem;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const Copyright = styled.p`
  margin: 0;
  color: var(--text-light);
`;

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <Copyright>
            &copy; {year} ScriptSQL. All rights reserved.
          </Copyright>
          <div>
            <span className="text-muted">Powered by AI</span>
          </div>
        </FooterContent>
      </div>
    </FooterContainer>
  );
};

export default Footer; 