import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { 
  Upload, 
  X, 
  ChevronLeft, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const UploadArea = styled.div`
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  transition: all 0.2s ease;
  background-color: var(--input-bg);
  cursor: pointer;
  
  &:hover, &.dragover {
    border-color: var(--text-color);
    background-color: var(--secondary-color);
  }
`;

const UploadIcon = styled.div`
  margin-bottom: 1.5rem;
  color: var(--text-color);
  display: flex;
  justify-content: center;
`;

const UploadText = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: var(--text-color);
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
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  margin-bottom: 0.75rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: var(--box-shadow);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FileName = styled.span`
  font-weight: 500;
  color: var(--text-color);
`;

const FileSize = styled.span`
  color: var(--text-light);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const FileDetails = styled.div`
  margin-left: 1rem;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: var(--text-color);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    box-shadow: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
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

const InfoPanel = styled.div`
  background-color: var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
  
  &::before {
    content: '📄';
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

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const DocumentUpload = ({ onSubmit, onBack }) => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
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
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0) {
      onSubmit(files);
    }
  };
  
  return (
    <Container>
      <Title>
        Step 2: Upload Documents
      </Title>
      
      <p>Upload the documents you want to extract data from. Supported formats: PDF, DOCX, TXT, HTML, MD, Pages and images.</p>
      
      <InfoToggle onClick={toggleInfo}>
        {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
        <span>Notes about file support</span>
      </InfoToggle>
      
      <InfoContent $isVisible={showInfo}>
        <InfoPanel>
          <InfoIcon>
            <Info size={20} strokeWidth={2.5} />
          </InfoIcon>
          <p style={{ margin: 0, position: 'relative', zIndex: 1 }}>
            <strong>Note:</strong> You can upload image files directly or documents containing image links.
            The system will include the image paths or URLs in the generated SQL without analyzing the image content.
          </p>
        </InfoPanel>
      </InfoContent>
      
      <form onSubmit={handleSubmit}>
        <UploadArea 
          className={dragOver ? 'dragover' : ''}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <UploadIcon>
            <Upload size={48} strokeWidth={1.5} />
          </UploadIcon>
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
                  <FileDetails>
                    <FileName>{file.name}</FileName>
                    <div>
                      <FileSize>{formatFileSize(file.size)}</FileSize>
                    </div>
                  </FileDetails>
                </div>
                <RemoveButton 
                  type="button" 
                  onClick={() => handleRemoveFile(index)}
                  title="Remove file"
                >
                  <X size={16} strokeWidth={2} />
                </RemoveButton>
              </FileItem>
            ))}
          </FileList>
        )}
        
        <ActionButtons>
          <button type="button" className="button-secondary" onClick={onBack}>
            <ChevronLeft size={16} strokeWidth={2} />
            Back
          </button>
          <button 
            type="submit" 
            className="button"
            disabled={files.length === 0}
          >
            Continue
          </button>
        </ActionButtons>
      </form>
    </Container>
  );
};

export default DocumentUpload; 