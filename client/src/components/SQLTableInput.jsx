import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const SqlInputContainer = styled.div`
  margin-bottom: 2rem;
`;

const SqlTextarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9rem;
  border: 1px solid #e5e5e7;
  border-radius: var(--border-radius);
  resize: vertical;
`;

const InputHelper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const InfoPanel = styled.div`
  background-color: rgba(0, 113, 227, 0.05);
  border-left: 3px solid var(--primary-color);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
`;

const EditorControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const SQLTableInput = ({ onSubmit }) => {
  const [sqlInput, setSqlInput] = useState('');
  const [errors, setErrors] = useState({});

  const loadSampleSQL = () => {
    setSqlInput(`CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) COMMENT 'Contact email address',
  phone VARCHAR(20) COMMENT 'Primary phone number',
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'USA',
  registration_date DATETIME
);

CREATE TABLE products (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL COMMENT 'Name of the product',
  description TEXT COMMENT 'Product description',
  category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL COMMENT 'Retail price',
  stock_quantity INT DEFAULT 0,
  supplier_id INT,
  created_at DATETIME
);`);
  };

  const clearSQL = () => {
    setSqlInput('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!sqlInput.trim()) {
      newErrors.sql = 'Please enter SQL CREATE TABLE statements';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Pass the raw SQL directly to the API
      onSubmit([{
        isRawSql: true,
        sqlDefinition: sqlInput
      }]);
    }
  };

  return (
    <Container>
      <h2>Step 1: Define Your SQL Tables</h2>
      <p>Enter your CREATE TABLE statements below. The AI will analyze these to understand your data structure.</p>
      
      <InfoPanel>
        <p>
          <strong>How it works:</strong> The AI will use your CREATE TABLE statements to understand the structure of your data. 
          It will then extract information from your documents that fits this structure and generate INSERT statements.
        </p>
      </InfoPanel>
      
      <form onSubmit={handleSubmit}>
        <SqlInputContainer>
          <InputHelper>
            <span className="text-muted">Define your MySQL tables with standard CREATE TABLE syntax</span>
            <EditorControls>
              <button 
                type="button" 
                className="button-secondary"
                onClick={loadSampleSQL}
              >
                Load Example
              </button>
              <button 
                type="button" 
                className="button-secondary"
                onClick={clearSQL}
              >
                Clear
              </button>
            </EditorControls>
          </InputHelper>
          <SqlTextarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder={`-- Enter your CREATE TABLE statements here:
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) COMMENT 'Customer email address',
  phone VARCHAR(20),
  signup_date DATE
);

-- Add as many tables as needed...`}
          />
          {errors.sql && (
            <div className="alert alert-error">{errors.sql}</div>
          )}
          
          <ActionButtons>
            <button 
              type="submit" 
              className="button"
              disabled={!sqlInput.trim()}
            >
              Continue to Document Upload
            </button>
          </ActionButtons>
        </SqlInputContainer>
      </form>
    </Container>
  );
};

export default SQLTableInput; 