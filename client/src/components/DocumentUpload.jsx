import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const UploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: var(--border-radius);
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  transition: all 0.2s ease;
  background-color: var(--secondary-color);
  
  &:hover, &.dragover {
    border-color: var(--primary-color);
    background-color: rgba(0, 113, 227, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
`;

const UploadText = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  background-color: var(--secondary-color);
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FileName = styled.span`
  font-weight: 500;
`;

const FileSize = styled.span`
  color: var(--text-light);
  font-size: 0.9rem;
`;

const FileTypeIcon = styled.span`
  margin-right: 0.75rem;
  color: var(--accent-color);
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: var(--danger-color);
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const InfoPanel = styled.div`
  background-color: var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 2rem;
`;

const DocumentUpload = ({ onSubmit, onBack }) => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...droppedFiles]);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    // Image formats
    const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'tif'];
    if (imageFormats.includes(extension)) {
      return '🖼️';
    }
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'txt':
        return '📃';
      case 'md':
        return '📑';
      case 'pages':
        return '📋';
      default:
        return '📁';
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0) {
      onSubmit(files);
    }
  };
  
  return (
    <Container>
      <h2>Step 2: Upload Documents</h2>
      <p>Upload the documents you want to extract data from. Supported formats: PDF, DOCX, TXT, HTML, MD, Pages and images (PNG, JPG, GIF, etc).</p>
      
      <InfoPanel>
        <p>
          <strong>Note about images:</strong> You can upload image files directly or documents containing image links.
          The system will include the image paths or URLs in the generated SQL without analyzing the image content.
        </p>
      </InfoPanel>
      
      <form onSubmit={handleSubmit}>
        <UploadArea 
          className={dragOver ? 'dragover' : ''}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <UploadIcon>📂</UploadIcon>
          <UploadText>
            Drag and drop files here, or click to select files
          </UploadText>
          <button type="button" className="button-secondary">
            Select Files
          </button>
          <FileInput 
            ref={fileInputRef}
            type="file" 
            multiple 
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.txt,.html,.htm,.md,.pages,.png,.jpg,.jpeg,.gif,.bmp,.webp,.svg,.tiff,.tif"
          />
        </UploadArea>
        
        {files.length > 0 && (
          <FileList>
            {files.map((file, index) => (
              <FileItem key={index}>
                <div className="flex align-center">
                  <FileTypeIcon>{getFileIcon(file.name)}</FileTypeIcon>
                  <div>
                    <FileName>{file.name}</FileName>
                    <div>
                      <FileSize>{formatFileSize(file.size)}</FileSize>
                    </div>
                  </div>
                </div>
                <RemoveButton 
                  type="button" 
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </RemoveButton>
              </FileItem>
            ))}
          </FileList>
        )}
        
        <ActionButtons>
          <button type="button" className="button-secondary" onClick={onBack}>
            Back
          </button>
          <button 
            type="submit" 
            className="button"
            disabled={files.length === 0}
          >
            Continue to AI Processing
          </button>
        </ActionButtons>
      </form>
    </Container>
  );
};

export default DocumentUpload; 