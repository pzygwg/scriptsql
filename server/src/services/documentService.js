const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cheerio = require('cheerio');
const { execSync } = require('child_process');

/**
 * Parse a document based on its file extension
 * @param {string} filePath Path to the document
 * @returns {Promise<string>} Document content as text
 */
async function parseDocument(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  
  try {
    switch (extension) {
      case '.pdf':
        return await parsePDF(filePath);
      case '.docx':
        return await parseDocx(filePath);
      case '.doc':
        return await parseDocx(filePath);
      case '.txt':
        return await parseTxt(filePath);
      case '.html':
      case '.htm':
        return await parseHtml(filePath);
      case '.md':
        return await parseMarkdown(filePath);
      case '.pages':
        return await parsePages(filePath);
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.bmp':
      case '.webp':
      case '.svg':
      case '.tiff':
      case '.tif':
        return await handleImage(filePath);
      default:
        // Check if it might be an image format we didn't explicitly listed
        if (/\.(jpe?g|png|gif|bmp|webp|svg|tiff?)$/i.test(extension)) {
          return await handleImage(filePath);
        }
        throw new Error(`Unsupported file format: ${extension}`);
    }
  } catch (error) {
    console.error(`Error parsing document ${filePath}:`, error);
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
 * Parse DOCX document
 */
async function parseDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
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
 * Note: This is a simple approach that tries to extract text
 * A more robust solution would use a specialized library
 */
async function parsePages(filePath) {
  try {
    // If on macOS, attempt to use textutil
    if (process.platform === 'darwin') {
      try {
        // Create output file path with a safe name (no spaces)
        const tempDir = path.dirname(filePath);
        const baseName = path.basename(filePath, '.pages');
        // Replace spaces and special characters with underscores for safety
        const safeBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
        const tempFile = path.join(tempDir, `${safeBaseName}_converted.txt`);
        
        // Use textutil with properly escaped paths
        // We need to escape both the input and output paths for shell safety
        const escapedInputPath = filePath.replace(/'/g, "'\\''");
        const escapedOutputPath = tempFile.replace(/'/g, "'\\''");
        
        const command = `textutil -convert txt -output '${escapedOutputPath}' '${escapedInputPath}'`;
        console.log(`Executing command: ${command}`);
        
        // Execute the command
        execSync(command);
        
        // Verify file exists before reading
        if (!fsSync.existsSync(tempFile)) {
          throw new Error(`Output file not created: ${tempFile}`);
        }
        
        // Read the converted file
        const content = await fs.readFile(tempFile, 'utf8');
        
        // Clean up the temp file
        try {
          await fs.unlink(tempFile);
        } catch (unlinkErr) {
          console.error(`Failed to delete temp file ${tempFile}:`, unlinkErr);
        }
        
        return content;
      } catch (error) {
        console.error(`Error using textutil to convert Pages document ${filePath}:`, error);
        // Continue to next method
      }
    }
    
    // Fallback: Try to extract text from the Pages package (it's actually a zip file)
    let AdmZip;
    try {
      AdmZip = require('adm-zip');
    } catch (err) {
      console.error('adm-zip module not found. Install it with: npm install adm-zip');
      return `Unable to parse Pages document: ${path.basename(filePath)}\n\nThis appears to be an Apple Pages document. The system attempted to extract text but the required tools were not available. For best results, please export this document as PDF or plain text before uploading.`;
    }
    
    try {
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();
      
      // Look for content in the expected locations in Pages package
      const contentFiles = [
        'index.xml', 
        'QuickLook/Preview.txt',
        'content.xml',
        'preview.txt',
        'preview-micro.txt',
        'preview-web.txt'
      ];
      
      // Try to find any of the content files
      for (const contentFile of contentFiles) {
        const entry = zip.getEntry(contentFile);
        if (entry) {
          const content = zip.readAsText(entry);
          if (content && content.trim().length > 0) {
            // Basic cleaning of XML/HTML tags
            return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          }
        }
      }
      
      // If no specific content file was found, just get any text file
      for (const entry of entries) {
        if (entry.name.endsWith('.txt') || entry.name.endsWith('.xml')) {
          const content = zip.readAsText(entry);
          if (content && content.trim().length > 0) {
            return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          }
        }
      }
    } catch (zipError) {
      console.error(`Error extracting text from Pages package ${filePath}:`, zipError);
      // Continue to fallback
    }
    
    // If all methods fail, return a helpful placeholder message
    return `Unable to extract content from Pages document: ${path.basename(filePath)}\n\nThis file appears to be in an unsupported format or may be corrupted. For best results, please convert it to PDF, DOCX, or TXT format before uploading.`;
  } catch (error) {
    console.error(`Error parsing Pages document ${filePath}:`, error);
    // Return a useful message instead of throwing an error
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