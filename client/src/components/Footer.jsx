import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--card-bg);
  padding: 1.5rem 0;
  margin-top: 3rem;
  font-size: 0.75rem;
  border-top: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
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
  transition: color 0.3s ease;
`;

const PoweredBy = styled.div`
  color: var(--text-light);
  transition: color 0.3s ease;
`;

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <Copyright>
            &copy; {year} ScriptSQL  ❤️
          </Copyright>
          <PoweredBy>
            deepseek my beloved
          </PoweredBy>
        </FooterContent>  
      </div>
    </FooterContainer>
  );
};

export default Footer; 