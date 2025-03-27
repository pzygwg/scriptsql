import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  ChevronLeft, 
  ArrowRight
} from 'lucide-react';
import ASCIICatLoader from './ASCIICatLoader';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
`;

const ProviderOption = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid ${props => props.selected ? 'var(--text-color)' : 'var(--border-color)'};
  background-color: ${props => props.selected ? 'var(--secondary-color)' : 'var(--card-bg)'};
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--text-color);
    box-shadow: var(--box-shadow);
  }
`;

const ProviderInfo = styled.div`
  flex: 1;
`;

const ProviderName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProviderDescription = styled.p`
  margin: 0;
  color: var(--text-light);
  font-size: 0.875rem;
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

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const RadioCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--text-color);
  margin-right: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.selected ? 'var(--text-color)' : 'transparent'};
    transition: background-color 0.2s ease;
  }
`;

const AIProcessing = ({ onProcess, onBack, isProcessing }) => {
  const [selectedProvider, setSelectedProvider] = useState('deepseek');
  
  const handleProviderSelect = (provider) => {
    if (!isProcessing && provider !== 'claude') {
      setSelectedProvider(provider);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onProcess(selectedProvider);
  };
  
  return (
    <Container>
      <Title>
        Step 3: Choose AI Provider
      </Title>
      <p>Select which AI model you want to use for processing your documents.</p>
      
      {isProcessing ? (
        <Card>
          <ProcessingIndicator>
            <ASCIICatLoader />
            <h3 className="mt-4">Processing Documents</h3>
            <p>This may take a few moments depending on the size and number of your documents.</p>
          </ProcessingIndicator>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <ProviderOption 
            selected={selectedProvider === 'claude'}
            onClick={() => handleProviderSelect('claude')}
            style={{ opacity: 0.6, cursor: 'not-allowed', position: 'relative' }}
          >
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.1)', 
              borderRadius: 'var(--border-radius)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'var(--text-color)'
            }}>
              🚧 Under Construction 🚧
            </div>
            <RadioCircle selected={selectedProvider === 'claude'} />
            <ProviderInfo>
              <ProviderName>Claude</ProviderName>
              <ProviderDescription>
                Anthropic's Claude model is excellent at understanding complex documents and extracting structured data. Also its 3.7 sonnet 🏎️🏎️
              </ProviderDescription>
            </ProviderInfo>
          </ProviderOption>
          
          <ProviderOption 
            selected={selectedProvider === 'deepseek'}
            onClick={() => handleProviderSelect('deepseek')}
          >
            <RadioCircle selected={selectedProvider === 'deepseek'} />
            <ProviderInfo>
              <ProviderName>DeepSeek</ProviderName>
              <ProviderDescription>
                DeepSeek's AI model is optimized for deep information extraction and analysis. Btw R1🏎️🏎️
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
              <ChevronLeft size={16} strokeWidth={2} />
              Back
            </button>
            <button 
              type="submit" 
              className="button"
              disabled={isProcessing}
            >
              <ArrowRight size={16} strokeWidth={2} />
              Process Documents
            </button>
          </ActionButtons>
        </form>
      )}
    </Container>
  );
};

export default AIProcessing;