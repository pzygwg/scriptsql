import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ProviderOption = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'transparent'};
  background-color: ${props => props.selected ? 'rgba(0, 113, 227, 0.05)' : 'var(--light-bg)'};
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(0, 113, 227, 0.05)' : '#f0f0f0'};
  }
`;

const ProviderLogo = styled.div`
  font-size: 2rem;
  margin-right: 1.5rem;
`;

const ProviderInfo = styled.div`
  flex: 1;
`;

const ProviderName = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const ProviderDescription = styled.p`
  margin: 0;
  color: var(--text-light);
`;

const ProcessingIndicator = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const AIProcessing = ({ onProcess, onBack, isProcessing }) => {
  const [selectedProvider, setSelectedProvider] = useState('claude');
  
  const handleProviderSelect = (provider) => {
    if (!isProcessing) {
      setSelectedProvider(provider);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onProcess(selectedProvider);
  };
  
  return (
    <Container>
      <h2>Step 3: Choose AI Provider</h2>
      <p>Select which AI model you want to use for processing your documents.</p>
      
      {isProcessing ? (
        <Card>
          <ProcessingIndicator>
            <div className="loader"></div>
            <h3 className="mt-4">Processing Documents</h3>
            <p>This may take a few moments depending on the size and number of your documents.</p>
          </ProcessingIndicator>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <ProviderOption 
            selected={selectedProvider === 'claude'}
            onClick={() => handleProviderSelect('claude')}
          >
            <ProviderLogo>🧠</ProviderLogo>
            <ProviderInfo>
              <ProviderName>Claude</ProviderName>
              <ProviderDescription>
                Anthropic's Claude model is excellent at understanding complex documents and extracting structured data.
              </ProviderDescription>
            </ProviderInfo>
          </ProviderOption>
          
          <ProviderOption 
            selected={selectedProvider === 'deepseek'}
            onClick={() => handleProviderSelect('deepseek')}
          >
            <ProviderLogo>🔍</ProviderLogo>
            <ProviderInfo>
              <ProviderName>DeepSeek</ProviderName>
              <ProviderDescription>
                DeepSeek's AI model is optimized for deep information extraction and analysis.
              </ProviderDescription>
            </ProviderInfo>
          </ProviderOption>
          
          <ActionButtons>
            <button 
              type="button" 
              className="button-secondary" 
              onClick={onBack}
              disabled={isProcessing}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="button"
              disabled={isProcessing}
            >
              Process Documents
            </button>
          </ActionButtons>
        </form>
      )}
    </Container>
  );
};

export default AIProcessing; 