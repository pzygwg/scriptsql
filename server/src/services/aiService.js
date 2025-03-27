const axios = require('axios');
const dotenv = require('dotenv');
const { logAIPrompt } = require('./loggerService');

// Load environment variables
dotenv.config();

/**
 * Call AI service to analyze documents and extract structured data
 * @param {Object} options Options for AI processing
 * @param {Array} options.documents Array of parsed documents
 * @param {Array|string} options.tables SQL table definitions (structured or raw SQL)
 * @param {string} options.provider AI provider (claude or deepseek)
 * @param {boolean} options.useRawSql Whether tables is raw SQL
 * @returns {Promise<Object|Array>} Extracted data structured for SQL generation or direct SQL statements
 */
async function callAI({ documents, tables, provider = 'claude', useRawSql = false }) {
  try {
    // Select the AI provider
    const aiFunction = provider === 'claude' ? callClaude : callDeepSeek;
    
    // Call the selected AI provider
    return await aiFunction(documents, tables, useRawSql);
  } catch (error) {
    console.error(`Error calling AI service (${provider}):`, error);
    throw new Error(`Failed to process with AI: ${error.message}`);
  }
}

/**
 * Call Claude API
 * @param {Array} documents Parsed documents
 * @param {Array|string} tables SQL table definitions (structured or raw SQL)
 * @param {boolean} useRawSql Whether tables is raw SQL
 * @returns {Promise<Object|Array>} Extracted data or SQL statements
 */
async function callClaude(documents, tables, useRawSql) {
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY is not set in environment variables');
  }
  
  if (!CLAUDE_API_KEY.startsWith('sk-ant-api')) {
    throw new Error('CLAUDE_API_KEY appears to be invalid. It should start with sk-ant-api');
  }
  
  // Format the documents content into a single string
  const documentsContent = documents.map(doc => 
    `--- Document: ${doc.filename} ---\n${doc.content}\n\n`
  ).join('\n');
  
  // Format tables based on input type
  let tablesDescription;
  
  if (useRawSql) {
    // Use the raw SQL directly
    tablesDescription = tables;
  } else {
    // Format structured tables into a description
    tablesDescription = tables.map(table => {
      const columnsDescription = table.columns.map(column => 
        `${column.name} (${column.type}): ${column.description || 'No description'}`
      ).join('\n  - ');
      
      return `Table: ${table.tableName}\nColumns:\n  - ${columnsDescription}`;
    }).join('\n\n');
  }
  
  // Construct the prompt for Claude based on input type
  let prompt;
  
  if (useRawSql) {
    prompt = `You are an expert data extraction AI. I will provide you with document contents and MySQL CREATE TABLE statements.
Your task is to extract relevant data from the documents and generate INSERT statements that match the table schemas.

Here are the MySQL table definitions:
${tablesDescription}

Here are the documents:
${documentsContent}

Extract all relevant data from the documents that matches the table schemas.
Generate MySQL INSERT statements for each table where you find relevant data.
Only include data you find in the documents, don't make up any information.
Make sure the generated SQL follows proper MySQL syntax with correct quoting and escaping.

IMPORTANT ABOUT IMAGES:
1. When you encounter [IMAGE FILE INFORMATION] blocks in the document, extract the image filename and path
2. If any column in your tables seems appropriate for image data (names containing 'image', 'photo', 'picture', etc.), use these paths as values
3. For image URLs or file paths found in other document text, include them as-is in the appropriate columns
4. Do not attempt to analyze the actual image content
5. Instead of using the entire image path, use /photosMovies/[nameoftheimage]

IMPORTANT ABOUT NULL VALUES:
1. You MUST include a value for EVERY column defined in the table
2. If data for a column is not found in the documents, you MUST explicitly use NULL (not empty string or other placeholder)
3. NEVER skip columns - all INSERT statements must have the exact same number of columns as defined in the table
4. Do NOT be lazy about including NULL values - they are crucial for proper SQL execution

IMPORTANT ABOUT LINE NUMBERING:
1. Each attribute and value in the output MUST be commented with its line number
2. Example:
INSERT INTO table_name (
  column1, -- 1 
  column2, -- 2 
  column3 -- 3 
) VALUES (
  value1, -- 1
  value2, -- 2 
  value3 -- 3
);
3. The numbering should be sequential throughout the entire output

IMPORTANT ABOUT TEXT VALUES:
1. For any text that contains special characters, especially single quotes ('), make sure they are properly escaped in SQL
2. For single quotes, use two single quotes ('') as escape sequence
3. Preserve all special characters as they appear in the document

Return only the generated SQL INSERT statements with no explanation, no markdown formatting.

Each INSERT statement should follow this format:
INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...);`;
  } else {
    prompt = `You are an expert data extraction AI. I will provide you with document contents and MySQL table definitions.
Your task is to extract relevant data from the documents that match the table schemas.

Here are the MySQL table definitions:
${tablesDescription}

Here are the documents:
${documentsContent}

Extract all relevant data from the documents that match the table schemas. 
For each table, create a structured JSON object containing arrays of records with column names as keys.

IMPORTANT ABOUT IMAGES:
1. When you encounter [IMAGE FILE INFORMATION] blocks in the document, extract the image filename and path
2. If any field in your tables seems appropriate for image data (names containing 'image', 'photo', 'picture', etc.), use these paths as values
3. For image URLs or file paths found in other document text, include them as-is in the appropriate fields
4. Do not attempt to analyze the actual image content
5. Instead of using the entire image path, use /photosMovies/[nameoftheimage]

IMPORTANT ABOUT NULL VALUES:
1. You MUST include a value for EVERY column defined in the table
2. If data for a column is not found in the documents, you MUST explicitly use NULL (not empty string or other placeholder)
3. NEVER skip columns - all INSERT statements must have the exact same number of columns as defined in the table
4. Do NOT be lazy about including NULL values - they are crucial for proper SQL execution

IMPORTANT ABOUT LINE NUMBERING:
1. Each attribute and value in the output MUST be commented with its line number
2. Example:
INSERT INTO table_name (
  column1, -- 1 
  column2, -- 2 
  column3 -- 3 
) VALUES (
  value1, -- 1
  value2, -- 2 
  value3 -- 3
);
3. The numbering should be sequential throughout the entire output

IMPORTANT ABOUT TEXT VALUES:
1. For any text that contains special characters, especially single quotes ('), make sure they are properly escaped in SQL
2. For single quotes, use two single quotes ('') as escape sequence
3. Preserve all special characters as they appear in the document

Format your response as a JSON object where keys are table names and values are arrays of records. 
Only include data you find in the documents, don't make up any information.
Don't include any explanation, just return valid JSON.

Expected output format:
{
  "tableName1": [
    { "column1": "value1", "column2": "value2", ... },
    { "column1": "value3", "column2": "value4", ... },
    ...
  ],
  "tableName2": [
    ...
  ],
  ...
}`;
  }

  // Call Claude API
  try {
    console.log('Calling Claude API...');
    
    // Log the prompt before sending to Claude
    logAIPrompt('claude', prompt, { useRawSql });
    
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      "model": "claude-3-7-sonnet-20250219",
      "max_tokens": 20000,
      "thinking": {
          "type": "enabled",
          "budget_tokens": 16000
      },
      messages: [
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });
    
    console.log('Claude API response received');
    
    // Extract the response content
    const content = response.data.content[0].text;
    
    if (useRawSql) {
      // Return the SQL statements as an array, splitting by semicolons
      const sqlStatements = content
        .replace(/```sql|```/g, '') // Remove any SQL markdown formatting
        .split(';')
        .map(sql => sql.trim())
        .filter(sql => sql.length > 0)
        .map(sql => sql + ';');
      
      return sqlStatements;
    } else {
      // Parse the JSON from Claude's response
      try {
        // Find JSON content (Claude might include markdown code blocks)
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                          content.match(/```\n([\s\S]*?)\n```/) ||
                          [null, content];
        
        const jsonContent = jsonMatch[1] || content;
        return JSON.parse(jsonContent);
      } catch (error) {
        console.error('Error parsing JSON from Claude response:', error);
        throw new Error('Failed to parse AI response: Invalid JSON format');
      }
    }
  } catch (error) {
    console.error('Error calling Claude API:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Call DeepSeek API
 * @param {Array} documents Parsed documents
 * @param {Array|string} tables SQL table definitions (structured or raw SQL)
 * @param {boolean} useRawSql Whether tables is raw SQL
 * @returns {Promise<Object|Array>} Extracted data or SQL statements
 */
async function callDeepSeek(documents, tables, useRawSql) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set in environment variables');
  }
  
  if (!DEEPSEEK_API_KEY.startsWith('sk-')) {
    throw new Error('DEEPSEEK_API_KEY appears to be invalid. It should start with sk-');
  }
  
  // Format the documents content into a single string
  const documentsContent = documents.map(doc => 
    `--- Document: ${doc.filename} ---\n${doc.content}\n\n`
  ).join('\n');
  
  // Format tables based on input type
  let tablesDescription;
  
  if (useRawSql) {
    // Use the raw SQL directly
    tablesDescription = tables;
  } else {
    // Format structured tables into a description
    tablesDescription = tables.map(table => {
      const columnsDescription = table.columns.map(column => 
        `${column.name} (${column.type}): ${column.description || 'No description'}`
      ).join('\n  - ');
      
      return `Table: ${table.tableName}\nColumns:\n  - ${columnsDescription}`;
    }).join('\n\n');
  }
  
  // Construct the prompt for DeepSeek based on input type
  let prompt;
  
  if (useRawSql) {
    prompt = `You are an expert data extraction AI. I will provide you with document contents and MySQL CREATE TABLE statements.
Your task is to extract relevant data from the documents and generate INSERT statements that match the table schemas.

Here are the MySQL table definitions:
${tablesDescription}

Here are the documents:
${documentsContent}

Extract all relevant data from the documents that matches the table schemas.
Generate MySQL INSERT statements for each table where you find relevant data.
Only include data you find in the documents, don't make up any information.
Make sure the generated SQL follows proper MySQL syntax with correct quoting and escaping.

IMPORTANT ABOUT IMAGES:
1. When you encounter [IMAGE FILE INFORMATION] blocks in the document, extract the image filename and path
2. If any column in your tables seems appropriate for image data (names containing 'image', 'photo', 'picture', etc.), use these paths as values
3. For image URLs or file paths found in other document text, include them as-is in the appropriate columns
4. Do not attempt to analyze the actual image content
5. Instead of using the entire image path, use /photosMovies/[nameoftheimage]

IMPORTANT ABOUT NULL VALUES:
1. You MUST include a value for EVERY column defined in the table
2. If data for a column is not found in the documents, you MUST explicitly use NULL (not empty string or other placeholder)
3. NEVER skip columns - all INSERT statements must have the exact same number of columns as defined in the table
4. Do NOT be lazy about including NULL values - they are crucial for proper SQL execution

IMPORTANT ABOUT LINE NUMBERING:
1. Each attribute and value in the output MUST be commented with its line number
2. Example:
INSERT INTO table_name (
  column1, -- 1 
  column2, -- 2 
  column3 -- 3 
) VALUES (
  value1, -- 1
  value2, -- 2 
  value3 -- 3
);
3. The numbering should be sequential throughout the entire output

IMPORTANT ABOUT TEXT VALUES:
1. For any text that contains special characters, especially single quotes ('), make sure they are properly escaped in SQL
2. For single quotes, use two single quotes ('') as escape sequence
3. Preserve all special characters as they appear in the document

Return only the generated SQL INSERT statements with no explanation, no markdown formatting.

Each INSERT statement should follow this format:
INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...);`;
  } else {
    prompt = `You are an expert data extraction AI. I will provide you with document contents and MySQL table definitions.
Your task is to extract relevant data from the documents that match the table schemas.

Here are the MySQL table definitions:
${tablesDescription}

Here are the documents:
${documentsContent}

Extract all relevant data from the documents that match the table schemas. 
For each table, create a structured JSON object containing arrays of records with column names as keys.

IMPORTANT ABOUT IMAGES:
1. When you encounter [IMAGE FILE INFORMATION] blocks in the document, extract the image filename and path
2. If any field in your tables seems appropriate for image data (names containing 'image', 'photo', 'picture', etc.), use these paths as values
3. For image URLs or file paths found in other document text, include them as-is in the appropriate fields
4. Do not attempt to analyze the actual image content
5. Instead of using the entire image path, use /photosMovies/[nameoftheimage]

IMPORTANT ABOUT NULL VALUES:
1. You MUST include a value for EVERY column defined in the table
2. If data for a column is not found in the documents, you MUST explicitly use NULL (not empty string or other placeholder)
3. NEVER skip columns - all INSERT statements must have the exact same number of columns as defined in the table
4. Do NOT be lazy about including NULL values - they are crucial for proper SQL execution

IMPORTANT ABOUT LINE NUMBERING:
1. Each attribute and value in the output MUST be commented with its line number
2. Example:
INSERT INTO table_name (
  column1, -- 1 
  column2, -- 2 
  column3 -- 3 
) VALUES (
  value1, -- 1
  value2, -- 2 
  value3 -- 3
);
3. The numbering should be sequential throughout the entire output

IMPORTANT ABOUT TEXT VALUES:
1. For any text that contains special characters, especially single quotes ('), make sure they are properly escaped in SQL
2. For single quotes, use two single quotes ('') as escape sequence
3. Preserve all special characters as they appear in the document

Format your response as a JSON object where keys are table names and values are arrays of records. 
Only include data you find in the documents, don't make up any information.
Don't include any explanation, just return valid JSON.

Expected output format:
{
  "tableName1": [
    { "column1": "value1", "column2": "value2", ... },
    { "column1": "value3", "column2": "value4", ... },
    ...
  ],
  "tableName2": [
    ...
  ],
  ...
}`;
  }

  // Call DeepSeek API
  // Log the prompt before sending to DeepSeek
  logAIPrompt('deepseek', prompt, { useRawSql });
  
  const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
    model: 'deepseek-reasoner',
    messages: [
      { role: 'user', content: prompt }
    ]
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    }
  });
  
  // Extract the response content
  const content = response.data.choices[0].message.content;
  
  if (useRawSql) {
    // Return the SQL statements as an array, splitting by semicolons
    const sqlStatements = content
      .replace(/```sql|```/g, '') // Remove any SQL markdown formatting
      .split(';')
      .map(sql => sql.trim())
      .filter(sql => sql.length > 0)
      .map(sql => sql + ';');
    
    return sqlStatements;
  } else {
    // Parse the JSON from DeepSeek's response
    try {
      // Find JSON content (DeepSeek might include markdown code blocks)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        [null, content];
      
      const jsonContent = jsonMatch[1] || content;
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error('Error parsing JSON from DeepSeek response:', error);
      throw new Error('Failed to parse AI response: Invalid JSON format');
    }
  }
}

module.exports = {
  callAI
}; 