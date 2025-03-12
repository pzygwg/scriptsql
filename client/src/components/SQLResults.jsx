import React, { useState } from 'react';
import styled from 'styled-components';
import { Copy, CheckCircle, ArrowLeft } from 'lucide-react';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const ResultsCard = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
`;

const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SQLContainer = styled.div`
  background-color: var(--input-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-top: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid var(--border-color);
`;

const SQLStatement = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const CopyButton = styled.button`
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const SuccessMessage = styled.span`
  color: var(--success-color);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SQLResults = ({ results, onReset }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleCopyToClipboard = () => {
    const sqlText = results.join('\n\n');
    navigator.clipboard.writeText(sqlText)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  return (
    <Container>
      <h2>Step 4: SQL Results</h2>
      <p>Here are the generated SQL INSERT statements based on your documents and table definitions.</p>
      
      <ResultsCard>
        <div className="flex justify-between align-center">
          <Title>
            Generated SQL Statements
          </Title>
          <CopyButton onClick={handleCopyToClipboard}>
            {copySuccess ? (
              <SuccessMessage>
                <CheckCircle size={16} strokeWidth={2} />
                Copied
              </SuccessMessage>
            ) : (
              <>
                <Copy size={16} strokeWidth={2} /> Copy
              </>
            )}
          </CopyButton>
        </div>
        
        {results.length > 0 ? (
          <SQLContainer>
            {results.map((sql, index) => (
              <SQLStatement key={index}>
                {sql}
              </SQLStatement>
            ))}
          </SQLContainer>
        ) : (
          <p className="text-muted">No SQL statements were generated. This could be because no relevant data was found in your documents that matches your table definitions.</p>
        )}
      </ResultsCard>
      
      <ActionButtons>
        <button 
          type="button" 
          className="button-secondary"
          onClick={onReset}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Start Over
        </button>
      </ActionButtons>
    </Container>
  );
};

export default SQLResults; 