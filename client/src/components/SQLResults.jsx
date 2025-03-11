import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const ResultsCard = styled.div`
  background-color: var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SQLContainer = styled.div`
  background-color: var(--light-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-top: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const SQLStatement = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e7;
  
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
  color: var(--primary-color);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessMessage = styled.span`
  color: var(--success-color);
  font-size: 0.9rem;
  margin-left: 0.5rem;
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
          <h3>Generated SQL Statements</h3>
          <CopyButton onClick={handleCopyToClipboard}>
            <span>📋</span> Copy All
            {copySuccess && <SuccessMessage>Copied!</SuccessMessage>}
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
          Start Over
        </button>
      </ActionButtons>
    </Container>
  );
};

export default SQLResults; 