# Invoice OCR Frontend

A React application for PDF invoice OCR and product information extraction using OpenAI's Vision API directly from the frontend.

## Features

- PDF upload and preview
- Template selection (Apple Invoice Data / Lenovo Invoice Data)
- **Editable template content** - Customize prompt templates directly in the UI
- Direct OpenAI Vision API integration for OCR processing (no backend required)
- Editable extracted data display
- CSV export functionality
- Multi-language support (English, Chinese, Japanese)
- Docker deployment support

## Setup Instructions

### Option 1: Local Development Setup

#### 1. Install Dependencies

```bash
# Install all dependencies
npm install
# or
pnpm install
```

#### 2. Start the Application

```bash
# Start the React development server
npm start
# or
pnpm start
```

The application will be available at `http://localhost:3000`

### Option 2: Docker Deployment

#### Prerequisites
- Docker
- Docker Compose

#### 1. Build and Run with Docker Compose

```bash
# Build and start the application
docker-compose up --build

# Run in background
docker-compose up -d --build
```

The application will be available at `http://localhost:3000`

#### 2. Stop the Application

```bash
# Stop the application
docker-compose down
```

#### 3. Rebuild After Changes

```bash
# Rebuild and restart
docker-compose down
docker-compose up --build
```

### Option 3: Docker Hub Deployment

#### 1. Build and Push to Docker Hub

```bash
# Build the image
docker build -t your-username/invoice-ocr-app:latest .

# Push to Docker Hub
docker push your-username/invoice-ocr-app:latest
```

#### 2. Pull and Run from Docker Hub

```bash
# Pull the image
docker pull your-username/invoice-ocr-app:latest

# Run the container
docker run -d -p 3000:80 --name invoice-ocr-app your-username/invoice-ocr-app:latest
```

#### 3. Using Docker Compose with Pre-built Image

Create a `docker-compose.prod.yml` file:

```yaml
version: '3.8'

services:
  invoice-ocr-app:
    image: your-username/invoice-ocr-app:latest
    ports:
      - "3000:80"
    restart: unless-stopped
    container_name: invoice-ocr-frontend
```

Then run:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. OpenAI API Key

#### For Local Development:
1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Create a `.env` file in the project root with the following content:
   ```
   REACT_APP_OPENAI_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your actual OpenAI API key
4. If no `.env` file is found, you'll be prompted to enter your API key when processing
5. Make sure you have credits in your OpenAI account

#### For Docker Deployment:
**Important**: The `.env` file is **NOT** included in the Docker image for security reasons.

**Option 1: Environment Variable (Recommended)**
```bash
# Run with environment variable
docker run -d -p 3000:80 -e REACT_APP_OPENAI_API_KEY=your_actual_api_key_here your-username/invoice-ocr-app:latest

# Or with docker-compose
# Create a docker-compose.override.yml file:
version: '3.8'
services:
  invoice-ocr-app:
    environment:
      - REACT_APP_OPENAI_API_KEY=your_actual_api_key_here
```

**Option 2: Volume Mount (Alternative)**
```bash
# Create .env file locally
echo "REACT_APP_OPENAI_API_KEY=your_actual_api_key_here" > .env

# Mount the .env file
docker run -d -p 3000:80 -v $(pwd)/.env:/app/.env your-username/invoice-ocr-app:latest
```

**Option 3: Prompt for API Key**
If no API key is provided, the application will prompt you to enter it when processing files.

## Usage

1. **Upload File**: Click "Select PDF、PNG、JPG to upload" or drag and drop a PDF, PNG, or JPG file
2. **Select Template**: Choose from:
   - "Extract Apple invoice data" - For Apple invoices
   - "Extract Lenovo invoice data" - For Lenovo invoices  
   - "Extract Picture data" - For custom image data extraction
3. **Edit Template (Optional)**: Click "Edit Template" to customize the prompt content
   - Modify the template text in the textarea
   - Changes are applied in real-time (no save button needed)
   - Click "Exit Edit" to return to view mode
4. **Process**: Click "Confirm conversion to CSV" to start OCR processing
   - PDF files: Will be converted to images first, then processed
   - Image files: Will be processed directly
   - Check browser console for detailed processing logs
   - You'll be prompted to enter your API key if not set
5. **Edit Data**: Review and edit the extracted data in the editable fields
6. **Export**: Click "Confirm download to CSV" to download the final data

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
    ├── template2.md     # Lenovo invoice data template
    └── template3.md     # Custom picture data template

# Docker files
├── Dockerfile            # Docker build configuration
├── docker-compose.yml    # Docker Compose configuration
├── nginx.conf           # Nginx configuration for production
└── .dockerignore        # Docker ignore file
```

## Templates

Templates are stored as Markdown files in `public/templates/`:
- `template1.md`: Apple invoice data extraction prompt
- `template2.md`: Lenovo invoice data extraction prompt
- `template3.md`: Custom picture data extraction prompt (with example fields for customization)

## Notes

- **No backend required**: The application calls OpenAI API directly from the frontend
- **Multi-format support**: Supports PDF, PNG, and JPG files
- **Real-time template editing**: Edit templates without saving - changes apply immediately
- OpenAI Vision API (gpt-4o model) is used for OCR processing
- API key can be stored in `.env` file or entered when needed
- Extracted data can be edited before CSV export
- All templates are in English (not internationalized)
- Uses native fetch API for reliable OpenAI communication
- **Docker deployment**: Includes Docker support with environment variable configuration

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

## Docker Environment Variables

**Important**: The Docker image now supports runtime environment variables. This means you can change the API key without rebuilding the image.

### How it works:
1. The Docker container creates a runtime configuration file (`env-config.js`) at startup
2. This file contains the environment variables passed to the container
3. The React application reads these variables at runtime

### Usage:
```bash
# Method 1: Environment variable (Recommended)
docker run -d -p 3000:80 -e REACT_APP_OPENAI_API_KEY=your_actual_api_key_here your-image

# Method 2: Using .env file
echo "REACT_APP_OPENAI_API_KEY=your_actual_api_key_here" > .env
docker run -d -p 3000:80 --env-file .env your-image

# Method 3: Using docker-compose
# Create docker-compose.override.yml:
version: '3.8'
services:
  invoice-ocr-app:
    environment:
      - REACT_APP_OPENAI_API_KEY=your_actual_api_key_here
```

### Troubleshooting:
- If you're still prompted for API key, check that the environment variable is correctly set
- The container logs will show: "Runtime config created with REACT_APP_OPENAI_API_KEY: sk-xxxxx..."
- You can verify the config by visiting `http://localhost:3000/env-config.js` in your browser