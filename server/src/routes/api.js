const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { 
  parseDocument,
  generateSQL
} = require('../services/documentService');
const { 
  callAI
} = require('../services/aiService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Process documents and generate SQL
router.post('/process', upload.array('documents'), async (req, res) => {
  try {
    const { aiProvider, useRawSql } = req.body;
    let tables;
    
    // Handle either raw SQL or structured tables
    if (useRawSql === 'true') {
      const { rawSql } = req.body;
      
      if (!rawSql) {
        return res.status(400).json({ error: 'SQL definition is required' });
      }
      
      // We'll pass the raw SQL as is to the AI
      tables = rawSql;
    } else {
      // Use structured tables as before
      const { tables: tablesJson } = req.body;
      
      // Validate input
      if (!tablesJson) {
        return res.status(400).json({ error: 'SQL tables are required' });
      }
      
      // Parse SQL tables schema
      try {
        tables = JSON.parse(tablesJson);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid SQL tables format' });
      }
    }
    
    // Validate documents
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No documents uploaded' });
    }
    
    // Parse each document
    const parsedDocuments = [];
    for (const file of req.files) {
      const content = await parseDocument(file.path);
      parsedDocuments.push({
        filename: file.originalname,
        content
      });
    }
    
    // Call AI service to analyze documents and extract data
    const extractedData = await callAI({
      documents: parsedDocuments,
      tables,
      provider: aiProvider || 'claude',
      useRawSql: useRawSql === 'true'
    });
    
    // Generate SQL INSERT statements
    const sqlStatements = useRawSql === 'true' 
      ? extractedData // If using raw SQL, the AI should directly return SQL statements
      : generateSQL(extractedData, tables);
    
    // Return the results
    res.json({
      success: true,
      sql: sqlStatements
    });
    
  } catch (error) {
    console.error('Error processing documents:', error);
    res.status(500).json({
      error: true,
      message: error.message || 'Error processing documents'
    });
  }
});

// Get available AI providers
router.get('/ai-providers', (req, res) => {
  res.json({
    providers: ['claude', 'deepseek']
  });
});

module.exports = router; 