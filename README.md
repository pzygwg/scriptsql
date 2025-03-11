# ScriptSQL - Document to SQL Converter

ScriptSQL is a web application that uses AI to extract data from documents and generate SQL INSERT statements based on your table definitions.

## Features

- Define SQL table schemas with custom columns and data types
- Import table definitions directly from CREATE TABLE statements
- Upload multiple document formats (PDF, DOCX, TXT, HTML)
- Choose between different AI providers (Claude or DeepSeek)
- Generate SQL INSERT statements from document content
- Copy generated SQL to clipboard

## Tech Stack

- **Frontend**: React with Vite, Styled Components
- **Backend**: Node.js, Express
- **Document Parsing**: PDF-Parse, Mammoth, Cheerio
- **AI Integration**: Claude API, DeepSeek API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- API keys for Claude and/or DeepSeek

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/scriptsql.git
   cd scriptsql
   ```

2. Install dependencies:
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   ```
   # In the server directory
   cp .env.example .env
   ```
   Then edit the `.env` file to add your API keys.

### Running the Application

1. Start the server:
   ```
   # In the server directory
   npm run dev
   ```

2. Start the client:
   ```
   # In the client directory
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Define SQL Tables**: Start by defining your SQL table schemas. You can either:
   - Use the Table Builder interface to manually define tables and columns
   - Paste your CREATE TABLE statements directly into the SQL Input tab

2. **Upload Documents**: Upload the documents from which you want to extract data. Supported formats include PDF, DOCX, TXT, and HTML.

3. **Choose AI Provider**: Select which AI model you want to use for processing your documents (Claude or DeepSeek).

4. **View Results**: After processing, view the generated SQL INSERT statements and copy them to your clipboard.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Anthropic](https://www.anthropic.com/) for the Claude API
- [DeepSeek](https://www.deepseek.com/) for the DeepSeek API
- All the open-source libraries used in this project
