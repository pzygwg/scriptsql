import React, { useState } from 'react';
import Header from './components/Header';
import SQLTableInput from './components/SQLTableInput';
import DocumentUpload from './components/DocumentUpload';
import AIProcessing from './components/AIProcessing';
import SQLResults from './components/SQLResults';
import Footer from './components/Footer';

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
    <div className="app">
      <Header />
      
      <main className="container">
        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
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
      </main>

      <Footer />
    </div>
  );
};

export default App; 