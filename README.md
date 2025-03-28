# ScriptSQL

A minimalist tool that transforms documents into SQL INSERT statements. Extract structured data from various document formats and generate ready-to-use SQL with AI.

## What It Does

ScriptSQL automates the tedious process of manual data entry by:
1. Extracting structured information from your documents
2. Converting that data into SQL INSERT statements based on your table definitions
3. Providing ready-to-use SQL code you can run in your database

## Key Features

- **Document Extraction**: Process PDFs, DOC/DOCX, TXT, HTML, and more
- **Smart AI Processing**: Uses AI to intelligently extract and structure data
- **Custom SQL Schema**: Define your own database tables with standard SQL syntax
- **Minimal Design**: Clean, distraction-free interface with light/dark mode

## Screenshots

![Step 1: Define SQL Tables](https://github.com/pzygwg/scriptsql/blob/main/screenshots/db.png)
*Step 1: Define your SQL schema with CREATE TABLE statements*

![Step 2: Upload Documents](https://github.com/pzygwg/scriptsql/blob/main/screenshots/upload.png)
*Step 2: Upload the documents containing your data*

![Step 3: Choose AI Provider](https://github.com/pzygwg/scriptsql/blob/main/screenshots/model.png)
*Step 3: Select which AI provider to use for processing*

![Step 4.1: View Results](https://github.com/pzygwg/scriptsql/blob/main/screenshots/result1.png)
![Step 4.2: View Results](https://github.com/pzygwg/scriptsql/blob/main/screenshots/result2.png)
*Step 4: Get your generated SQL INSERT statements*


## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/scriptsql.git
cd scriptsql

# Install server dependencies
cd server
npm install

# Configure environment variables
# Create a .env file with your API keys
# CLAUDE_API_KEY=your-key
# DEEPSEEK_API_KEY=your-key

# Start the server
npm start

# In a new terminal, install and start the client
cd ../client
npm install
npm run dev
```

## Usage Flow

1. **Define Your Database Schema**: Start by defining the structure of your SQL tables.
2. **Upload Documents**: Add the documents containing the data you want to extract.
3. **Process with AI**: Choose an AI provider to analyze your documents.
4. **Get SQL Statements**: Copy the generated SQL INSERT statements for your database.

## Supported Document Formats

- PDF files 
- Word documents (DOCX, DOC)
- Text files (TXT, HTML, Markdown)
- Apple Pages documents

## Development

This project uses:
- React frontend with styled-components
- Node.js/Express backend
- Integration with AI APIs (Claude, DeepSeek)

## License

MIT License
