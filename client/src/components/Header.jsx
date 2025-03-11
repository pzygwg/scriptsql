import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: var(--light-bg);
  padding: 1.5rem 0;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  color: var(--text-color);
  display: flex;
  align-items: center;
  
  span {
    color: var(--primary-color);
    font-weight: 700;
  }
`;

const Tagline = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-light);
`;

const Header = () => {
  return (
    <HeaderContainer>
      <div className="container">
        <HeaderContent>
          <div>
            <Logo>
              Script<span>SQL</span>
            </Logo>
            <Tagline>Convert documents to SQL with AI</Tagline>
          </div>
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

export default Header; 