import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Database, 
  Code, 
  Info, 
  FileCode, 
  RefreshCw, 
  ArrowRight,
  Trash2,
  FilePlus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

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
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius);
  resize: vertical;
  line-height: 1.5;
  background-color: #f9fafb;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
    background-color: white;
  }
`;

const InputHelper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const InfoPanel = styled.div`
  background-color: var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
  
  &::before {
    content: '😹';
    position: absolute;
    opacity: 0.1;
    font-size: 6rem;
    right: -1rem;
    bottom: -1.5rem;
  }
`;

const InfoIcon = styled.div`
  color: var(--text-color);
  margin-right: 1rem;
  float: left;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoToggle = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
  user-select: none;
  padding: 0.5rem 0.75rem;
  border-radius: 2rem;
  background-color: var(--card-bg);
  display: inline-flex;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
  
  &:hover {
    color: var(--text-color);
    background-color: var(--secondary-color);
    transform: translateY(-1px);
  }
`;

const InfoContent = styled.div`
  max-height: ${props => props.$isVisible ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-bottom: ${props => props.$isVisible ? '1.5rem' : '0'};
`;

const EditorControls = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SQLTableInput = ({ onSubmit, initialTables = [] }) => {
  let startingSql = '';
  
  if (initialTables.length > 0 && initialTables[0].isRawSql) {
    startingSql = initialTables[0].sqlDefinition;
  }
  
  const [sqlInput, setSqlInput] = useState(startingSql);
  const [errors, setErrors] = useState({});
  const [showInfo, setShowInfo] = useState(false);

  const loadSampleSQL = () => {
    setSqlInput(`-- Create a simple movies database
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  release_year INT,
  genre VARCHAR(100),
  director VARCHAR(255),
  duration INT COMMENT 'Duration in minutes',
  rating DECIMAL(3,1) COMMENT 'Rating from 0.0 to 10.0'
);

-- Create a table for movie reviews
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  reviewer_name VARCHAR(255) NOT NULL,
  rating INT COMMENT 'Rating from 1 to 5',
  review_text TEXT,
  review_date DATE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Create a table for cast members
CREATE TABLE cast_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  actor_name VARCHAR(255) NOT NULL,
  character_name VARCHAR(255),
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
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

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <Container>
      <Title>
        <Database size={24} strokeWidth={2} />
        Step 1: Define Your SQL Tables
      </Title>
      <p>Enter your CREATE TABLE statements below. The AI will analyze these to understand your data structure.</p>
      
      <InfoToggle onClick={toggleInfo}>
        {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
        <span>How it works</span>
      </InfoToggle>
      
      <InfoContent $isVisible={showInfo}>
        <InfoPanel>
          <InfoIcon>
            <Info size={20} strokeWidth={2.5} />
          </InfoIcon>
          <p style={{ margin: 0, position: 'relative', zIndex: 1 }}>
            <strong>How it works:</strong> The AI will use your CREATE TABLE statements to understand the structure of your data. 
            It will then extract information from your documents that fits this structure and generate INSERT statements.
          </p>
        </InfoPanel>
      </InfoContent>
      
      <form onSubmit={handleSubmit}>
        <SqlInputContainer>
          <InputHelper>
            <div className="flex align-center gap-2">
              <Code size={16} strokeWidth={2} />
              <span className="text-muted">Define your MySQL tables with standard CREATE TABLE syntax</span>
            </div>
            <EditorControls>
              <button 
                type="button" 
                className="button-secondary"
                onClick={loadSampleSQL}
              >
                <FileCode size={16} strokeWidth={2} />
                Load Example
              </button>
              <button 
                type="button" 
                className="button-secondary"
                onClick={clearSQL}
              >
                <Trash2 size={16} strokeWidth={2} />
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
            <div className="alert alert-error">
              <RefreshCw size={16} strokeWidth={2} />
              {errors.sql}
            </div>
          )}
          
          <ActionButtons>
            <button 
              type="submit" 
              className="button"
              disabled={!sqlInput.trim()}
            >
              <ArrowRight size={16} strokeWidth={2} />
              Continue to Document Upload
            </button>
          </ActionButtons>
        </SqlInputContainer>
      </form>
    </Container>
  );
};

export default SQLTableInput; 