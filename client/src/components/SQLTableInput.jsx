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
  background-color: rgba(0, 112, 243, 0.05);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid rgba(0, 112, 243, 0.1);
`;

const InfoIcon = styled.div`
  color: var(--primary-color);
  margin-top: 2px;
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
  
  &:hover {
    color: var(--text-color);
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
    setSqlInput(`-- Create movies table with all the requested fields
CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY, --1
  title VARCHAR(255) NOT NULL, --2
  international_title VARCHAR(255), --3
  year INT, --4
  duration VARCHAR(50), --5
  format VARCHAR(100), --6
  genre VARCHAR(100), --7
  genre_en VARCHAR(100), --8
  languages VARCHAR(255), --9
  languages_en VARCHAR(255), --10
  subtitles VARCHAR(255), --11
  subtitles_en VARCHAR(255), --12
  colorimetry VARCHAR(100), --13
  colorimetry_en VARCHAR(100), --14
  release_date DATE, --15
  short_synopsis TEXT, --16
  short_synopsis_en TEXT, --17
  long_synopsis TEXT, --18
  long_synopsis_en TEXT, --19
  director_notes TEXT, --20
  director_notes_en TEXT, --21
  literary_sources TEXT, --22
  literary_sources_en TEXT, --23
  references_info TEXT, --24
  references_info_en TEXT, --25
  director VARCHAR(255) NOT NULL, --26
  screenwriter VARCHAR(255), --27
  author VARCHAR(255), --28
  co_author VARCHAR(255), --29
  production VARCHAR(255), --30
  co_production VARCHAR(255), --31
  cinematographer VARCHAR(255), --32
  camera_operator VARCHAR(255), --33
  sound_engineer VARCHAR(255), --34
  sound_operator VARCHAR(255), --35
  sound_assistants TEXT, --36
  sound_assistants_en TEXT, --37
  editor VARCHAR(255), --38
  chief_editor VARCHAR(255), --39
  assistant_editor VARCHAR(255), --40
  editing_intern VARCHAR(255), --41
  sound_editor VARCHAR(255), --42
  sound_designer VARCHAR(255), --43
  composer VARCHAR(255), --44
  original_music TEXT, --45
  original_music_en TEXT, --46
  mixing VARCHAR(255), --47
  color_grading VARCHAR(255), --48
  visual_effects TEXT, --49
  visual_effects_en TEXT, --50
  three_d_work TEXT, --51
  animation TEXT, --52
  set_designer VARCHAR(255), --53
  set_decoration TEXT, --54
  set_decoration_en TEXT, --55
  costume_designer VARCHAR(255), --56
  makeup_hair TEXT, --57
  makeup_hair_en TEXT, --58
  production_companies TEXT, --59
  production_companies_en TEXT, --60
  financial_support TEXT, --61
  financial_support_en TEXT, --62
  grants TEXT, --63
  grants_en TEXT, --64
  distribution VARCHAR(255), --65
  international_sales VARCHAR(255), --66
  press_agent VARCHAR(255), --67
  festivals TEXT, --68
  festivals_en TEXT, --69
  awards TEXT, --70
  awards_en TEXT, --71
  nominations TEXT, --72
  nominations_en TEXT, --73
  distinctions TEXT, --74
  distinctions_en TEXT, --75
  tv_channels TEXT, --76
  vod_platforms TEXT, --77
  broadcast_dates TEXT, --78
  shooting_format VARCHAR(100), --79
  aspect_ratio VARCHAR(50), --80
  distribution_media TEXT, --81
  distribution_media_en TEXT, --82
  sound_type VARCHAR(100), --83
  cnc_visa VARCHAR(100), --84
  isan VARCHAR(100), --85
  age_restriction VARCHAR(50), --86
  keywords TEXT, --87
  keywords_en TEXT, --88
  director_biography TEXT, --89
  filmography TEXT, --90
  director_contact TEXT, --91
  availability TEXT, --92
  rights TEXT, --93
  promotion_marketing TEXT, --94
  financial_elements TEXT, --95
  box_office TEXT, --96
  audience TEXT, --97
  dvd_edition TEXT, --98
  archive_elements TEXT, --99
  authorizations TEXT, --100
  other_info TEXT, --101
  vimeo_link VARCHAR(255), --102
  category ENUM('released', 'in project') NOT NULL, --103
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --104
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP --105
);

-- Create movie_images table for multiple images per movie
CREATE TABLE IF NOT EXISTS movie_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  image_type ENUM('poster', 'still', 'behind_the_scenes', 'promotional', 'other') DEFAULT 'still',
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
            <Info size={18} strokeWidth={2} />
          </InfoIcon>
          <p style={{ margin: 0 }}>
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