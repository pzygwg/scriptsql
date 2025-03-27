const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cheerio = require('cheerio');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');
const textract = require('textract');
const util = require('util');

// Convert textract callback to promise
const textractFromFileAsync = util.promisify(textract.fromFileWithPath);

/**
 * Parse a document based on its file extension
 * @param {string} filePath Path to the document
 * @returns {Promise<string>} Document content as text
 */
async function parseDocument(filePath) {
  console.log(`Parsing document: ${filePath}`);
  
  // Check if file exists
  try {
    await fs.access(filePath);
  } catch (error) {
    console.error(`File does not exist or is not accessible: ${filePath}`);
    throw new Error(`File not found: ${filePath}`);
  }
  
  const extension = path.extname(filePath).toLowerCase();
  
  try {
    let result;
    
    switch (extension) {
      case '.pdf':
        console.log(`Processing PDF file: ${filePath}`);
        result = await parsePDF(filePath);
        break;
      case '.docx':
        console.log(`Processing DOCX file: ${filePath}`);
        result = await parseDocx(filePath);
        break;
      case '.doc':
        console.log(`Processing DOC file: ${filePath}`);
        // Use textract specifically for .doc files
        result = await parseDoc(filePath);
        break;
      case '.txt':
        console.log(`Processing text file: ${filePath}`);
        result = await parseTxt(filePath);
        break;
      case '.html':
      case '.htm':
        console.log(`Processing HTML file: ${filePath}`);
        result = await parseHtml(filePath);
        break;
      case '.md':
        console.log(`Processing Markdown file: ${filePath}`);
        result = await parseMarkdown(filePath);
        break;
      case '.pages':
        console.log(`Processing Pages document: ${filePath}`);
        result = await parsePages(filePath);
        break;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.bmp':
      case '.webp':
      case '.svg':
      case '.tiff':
      case '.tif':
        console.log(`Processing image file: ${filePath}`);
        result = await handleImage(filePath);
        break;
      default:
        // Check if it might be an image format we didn't explicitly listed
        if (/\.(jpe?g|png|gif|bmp|webp|svg|tiff?)$/i.test(extension)) {
          console.log(`Processing other image format: ${filePath}`);
          result = await handleImage(filePath);
        } else {
          throw new Error(`Unsupported file format: ${extension}`);
        }
    }
    
    console.log(`Successfully parsed document: ${filePath}`);
    return result;
  } catch (error) {
    console.error(`Error parsing document ${filePath}:`, error);
    console.error(`Error stack:`, error.stack);
    throw new Error(`Failed to parse document: ${error.message}`);
  }
}

/**
 * Parse PDF document
 */
async function parsePDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

/**
 * Parse DOCX document using mammoth
 */
async function parseDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

/**
 * Parse DOC document using textract
 */
async function parseDoc(filePath) {
  try {
    console.log(`Using textract to process .doc file: ${filePath}`);
    const text = await textractFromFileAsync(filePath);
    console.log(`Successfully extracted text from .doc file: ${filePath}`);
    return text;
  } catch (error) {
    console.error(`Error extracting text from .doc file: ${error}`);
    return `[ERROR PROCESSING DOC FILE] 
Unable to extract text from ${path.basename(filePath)}: ${error.message}
Please try converting this file to .docx, .pdf, or .txt format.
[END OF ERROR MESSAGE]`;
  }
}

/**
 * Parse TXT document
 */
async function parseTxt(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return content;
}

/**
 * Parse HTML document
 */
async function parseHtml(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const $ = cheerio.load(content);
  return $('body').text();
}

/**
 * Parse Markdown document
 */
async function parseMarkdown(filePath) {
  // Markdown is essentially a text file, so we can read it directly
  const content = await fs.readFile(filePath, 'utf8');
  return content;
}

/**
 * Handle image files
 * Instead of parsing content, we'll return information about the image
 */
async function handleImage(filePath) {
  try {
    // Get file stats to include size information
    const stats = await fs.stat(filePath);
    const fileName = path.basename(filePath);
    
    // Extract relevant parts of the filename (without extension)
    const baseName = path.basename(fileName, path.extname(fileName));
    
    // Create a structured text representation of the image
    return `[IMAGE FILE INFORMATION]
Filename: ${fileName}
Size: ${formatFileSize(stats.size)}
Type: ${path.extname(filePath).substring(1).toUpperCase()} image
Path: ${filePath}

- This is an image file and not text content
- The AI will include this image reference in the generated SQL
- Image content is not analyzed
[END OF IMAGE INFORMATION]`;
  } catch (error) {
    console.error(`Error handling image file: ${error}`);
    throw new Error(`Failed to process image file: ${error.message}`);
  }
}

/**
 * Format file size in a human-readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Parse Apple Pages document
 * @param {string} filePath Path to the document
 * @returns {Promise<string>} Extracted text content
 */
async function parsePages(filePath) {
  try {
    // Verify file exists before trying to process it
    if (!fsSync.existsSync(filePath)) {
      return `Cannot process Pages document: File not found at ${filePath}`;
    }

    // If file size is zero or too small to be a valid Pages file
    const stats = fsSync.statSync(filePath);
    if (stats.size < 100) { // Reasonable minimum size for a Pages file
      return `Cannot process Pages document: File appears to be empty or corrupted (${stats.size} bytes)`;
    }

    // Pages files are essentially ZIP archives with XML content
    try {
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();
      
      // First look for the main content file
      const contentEntry = entries.find(entry => 
        !entry.isDirectory && 
        (entry.entryName.includes('index.xml') || 
         entry.entryName.includes('document.xml') ||
         entry.entryName.includes('Document.xml') ||
         entry.entryName.includes('preview-web.html') ||
         entry.entryName.includes('Preview.html'))
      );
      
      if (contentEntry) {
        const content = zip.readAsText(contentEntry);
        if (content && content.trim().length > 0) {
          // If it's HTML content, extract text using cheerio
          if (contentEntry.entryName.endsWith('.html')) {
            const $ = cheerio.load(content);
            return $('body').text().trim();
          }
          
          // If it's XML content, extract text by removing tags
          if (contentEntry.entryName.endsWith('.xml')) {
            return content
              .replace(/<[^>]*>/g, ' ')  // Remove XML/HTML tags
              .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
              .trim();
          }
          
          return content;
        }
      }
      
      // If main content not found, try to extract text from all possible content files
      const allExtractedText = [];
      
      for (const entry of entries) {
        if (!entry.isDirectory) {
          // Look for files that might contain text content
          if (entry.entryName.endsWith('.txt') || 
              entry.entryName.endsWith('.xml') || 
              entry.entryName.includes('content') || 
              entry.entryName.includes('Content') || 
              entry.entryName.includes('text') || 
              entry.entryName.includes('Text') || 
              entry.entryName.includes('preview') || 
              entry.entryName.includes('Preview')) {
            
            try {
              const content = zip.readAsText(entry);
              if (content && content.trim().length > 0) {
                // For XML files, extract plain text
                if (entry.entryName.endsWith('.xml')) {
                  const plainText = content
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                  
                  if (plainText.length > 0) {
                    allExtractedText.push(plainText);
                  }
                } else {
                  allExtractedText.push(content.trim());
                }
              }
            } catch (readErr) {
              // Ignore errors reading individual files
              console.log(`Error reading ${entry.entryName}: ${readErr.message}`);
            }
          }
        }
      }
      
      if (allExtractedText.length > 0) {
        // Filter out duplicates and join all extracted text
        const uniqueTexts = [...new Set(allExtractedText)];
        return uniqueTexts.join('\n\n');
      }
      
      // If we couldn't extract text, suggest conversion
      return `Unable to extract content from ${path.basename(filePath)}\n\nThis appears to be an Apple Pages document. For best results, please export this document as PDF or DOCX before uploading.`;
    } catch (zipError) {
      console.error(`Error extracting text from Pages package ${filePath}:`, zipError);
      return `Error processing Pages document: ${path.basename(filePath)}\n\nThe system encountered an error while processing this file. For best results, please convert it to PDF, DOCX, or TXT format before uploading.`;
    }
  } catch (error) {
    console.error(`Error parsing Pages document ${filePath}:`, error);
    return `Error processing Pages document: ${path.basename(filePath)}\n\nThe system encountered an error while processing this file. For best results, please convert it to PDF, DOCX, or TXT format before uploading.`;
  }
}

/**
 * Generate SQL INSERT statements from extracted data
 * @param {Object} extractedData Data extracted from documents
 * @param {Array} tables SQL table definitions
 * @returns {Array} SQL INSERT statements
 */
function generateSQL(extractedData, tables) {
  const sqlStatements = [];

  // Generate a SQL INSERT statement for each table and entry
  tables.forEach(table => {
    const { tableName, columns } = table;
    
    if (extractedData[tableName]) {
      extractedData[tableName].forEach(entry => {
        // Start building the SQL statement
        let columnNames = [];
        let columnValues = [];
        
        // Process each column
        columns.forEach(column => {
          const columnName = column.name;
          if (entry[columnName] !== undefined) {
            columnNames.push(columnName);
            
            // Format the value based on the column type
            let value = entry[columnName];
            if (column.type.includes('varchar') || column.type.includes('text') || column.type.includes('date')) {
              // Escape single quotes for string values
              value = `'${value.replace(/'/g, "''")}'`;
            }
            
            columnValues.push(value);
          }
        });
        
        // Build the SQL INSERT statement
        if (columnNames.length > 0) {
          const sql = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${columnValues.join(', ')});`;
          sqlStatements.push(sql);
        }
      });
    }
  });
  
  return sqlStatements;
}

module.exports = {
  parseDocument,
  generateSQL
}; 