# Invoice OCR Frontend

A React application for PDF invoice OCR and product information extraction using OpenAI's Vision API directly from the frontend.

## Features

- PDF upload and preview
- Template selection (Apple Invoice Data / Lenovo Invoice Data)
- Direct OpenAI Vision API integration for OCR processing (no backend required)
- Editable extracted data display
- CSV export functionality
- Multi-language support (English, Chinese, Japanese)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install all dependencies
npm install
# or
pnpm install
```

### 2. Start the Application

```bash
# Start the React development server
npm start
# or
pnpm start
```

The application will be available at `http://localhost:3000`

### 3. OpenAI API Key

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Create a `.env` file in the project root with the following content:
   ```
   REACT_APP_OPENAI_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your actual OpenAI API key
4. If no `.env` file is found, you'll be prompted to enter your API key when processing
5. Make sure you have credits in your OpenAI account

## Usage

1. **Upload PDF**: Click "Select PDF to upload" or drag and drop a PDF file
2. **Select Template**: Choose between "Extract Apple invoice data" or "Extract Lenovo invoice data"
3. **Process**: Click "Confirm conversion to CSV" to start OCR processing
   - Check browser console for detailed processing logs
   - You'll be prompted to enter your API key if not set in `.env`
4. **Edit Data**: Review and edit the extracted data in the editable fields
5. **Export**: Click "Confirm download to CSV" to download the final data

## File Structure

```
src/
├── App.js                 # Main application component
├── App.css               # Application styles
├── components/
│   ├── LanguageSwitcher.js # Language switching component
│   ├── PDFPreview.js      # PDF preview component
│   └── ...
├── locales/              # Translation files
│   ├── en.json
│   ├── zh.json
│   └── ja.json
└── ...

public/
└── templates/            # Template files
    ├── template1.md      # Apple invoice data template
    └── template2.md     # Lenovo invoice data template
```

## Templates

Templates are stored as Markdown files in `public/templates/`:
- `template1.md`: Apple invoice data extraction prompt
- `template2.md`: Lenovo invoice data extraction prompt

## Notes

- **No backend required**: The application calls OpenAI API directly from the frontend
- OpenAI Vision API (gpt-4o model) is used for OCR processing
- API key can be stored in `.env` file or entered when needed
- Extracted data can be edited before CSV export
- All templates are in English (not internationalized)
- Uses native fetch API for reliable OpenAI communication

## Debugging

The application provides detailed console logging for debugging:

- **Processing start**: Shows selected file, template, and API key status
- **Complete prompt**: Displays the full template content being sent to OpenAI
- **Request payload**: Shows the API request structure (with image size info)
- **Processing progress**: Timestamps for API calls and responses
- **Response details**: Raw OpenAI response and usage statistics
- **Parsed data**: Final structured data after parsing
- **Error details**: Comprehensive error information including type, message, stack trace, and API response details

Open browser console (F12) to view all debugging information during OCR processing.