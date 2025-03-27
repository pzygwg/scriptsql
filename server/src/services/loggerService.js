const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log AI prompt to a file
 * @param {string} provider - AI provider name ('claude' or 'deepseek')
 * @param {string} prompt - The complete prompt sent to the AI
 * @param {Object} [metadata] - Additional metadata about the request (optional)
 */
const logAIPrompt = (provider, prompt, metadata = {}) => {
  try {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `${provider}_prompt_${timestamp}.log`;
    const filePath = path.join(logsDir, filename);
    
    const logContent = {
      timestamp: new Date().toISOString(),
      provider,
      prompt,
      metadata
    };
    
    fs.writeFileSync(filePath, JSON.stringify(logContent, null, 2));
    console.log(`AI prompt logged to ${filename}`);
  } catch (error) {
    console.error('Error logging AI prompt:', error);
  }
};

module.exports = {
  logAIPrompt
}; 