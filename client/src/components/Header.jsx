import React from 'react';
import styled from 'styled-components';
import ThemeToggle from './ThemeToggle';
import ASCIICatLogo from './ASCIICatLogo';

const HeaderContainer = styled.header`
  background-color: var(--card-bg);
  padding: 1.25rem 0;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  transition: background-color 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-color);
  font-weight: 500;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
`;

const Tagline = styled.p`
  display: none;

  @media (min-width: 768px) {
    display: block;
    margin: 0 0 0 1rem;
    font-size: 0.875rem;
    color: var(--text-light);
    transition: color 0.3s ease;
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <div className="container">
        <HeaderContent>
          <LeftContent>
            <ASCIICatLogo />
            <LogoText>ScriptSQL</LogoText>
            <Tagline>Convert documents to SQL with AI</Tagline>
          </LeftContent>
          <ThemeToggle />
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

export default Header; 