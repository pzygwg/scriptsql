import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import SQLTableInput from './components/SQLTableInput';
import DocumentUpload from './components/DocumentUpload';
import AIProcessing from './components/AIProcessing';
import SQLResults from './components/SQLResults';
import Footer from './components/Footer';
import { AlertCircle } from 'lucide-react';
import ThemeProvider from './context/ThemeContext';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--app-bg);
  transition: background-color 0.3s ease;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1.5rem 0;
`;

const ErrorAlert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
`;

const ErrorIcon = styled.div`
  color: var(--text-color);
  margin-top: 2px;
`;

const App = () => {
  const [tables, setTables] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [sqlResults, setSqlResults] = useState([]);
  const [aiProvider, setAiProvider] = useState('claude');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleTablesSubmit = (tables) => {
    setTables(tables);
    setCurrentStep(2);
  };

  const handleDocumentsSubmit = (files) => {
    setDocuments(files);
    setCurrentStep(3);
  };

  const handleProcessing = async (provider) => {
    setAiProvider(provider);
    setIsProcessing(true);
    setError(null);

    // Create form data for file upload
    const formData = new FormData();
    documents.forEach(file => {
      formData.append('documents', file);
    });

    // Check if we're using raw SQL or structured tables
    const hasRawSql = tables.length > 0 && tables[0].isRawSql;
    
    // Add tables and AI provider
    if (hasRawSql) {
      formData.append('rawSql', tables[0].sqlDefinition);
      formData.append('useRawSql', 'true');
    } else {
      formData.append('tables', JSON.stringify(tables));
    }
    
    formData.append('aiProvider', provider);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error processing documents');
      }

      setSqlResults(data.sql);
      setCurrentStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setTables([]);
    setDocuments([]);
    setSqlResults([]);
    setCurrentStep(1);
    setError(null);
  };

  return (
    <ThemeProvider>
      <AppContainer>
        <Header />
        
        <MainContent className="container">
          {error && (
            <ErrorAlert className="alert alert-error">
              <ErrorIcon>
                <AlertCircle size={18} strokeWidth={2} />
              </ErrorIcon>
              <p style={{ margin: 0 }}>{error}</p>
            </ErrorAlert>
          )}

          {currentStep === 1 && (
            <SQLTableInput 
              onSubmit={handleTablesSubmit} 
              initialTables={tables}
            />
          )}

          {currentStep === 2 && (
            <DocumentUpload 
              onSubmit={handleDocumentsSubmit} 
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <AIProcessing 
              onProcess={handleProcessing}
              onBack={() => setCurrentStep(2)}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 4 && (
            <SQLResults 
              results={sqlResults}
              onReset={resetForm}
            />
          )}
        </MainContent>

        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 