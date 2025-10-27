# Getting Started with Invoice OCR Frontend

This project is a React frontend application for PDF invoice OCR and product information extraction.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Features

- **PDF Upload**: Drag and drop or click to upload PDF files
- **Template Selection**: Choose from predefined templates for data extraction
- **Product Information Extraction**: Extract detailed product information including:
  - Manufacturer details
  - Product specifications
  - Pricing information
  - Physical dimensions and weight
  - Warranty and accessory information
- **CSV Export**: Convert extracted data to CSV format

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # Application entry point
└── index.css       # Global styles
```

## Technologies Used

- React 18
- React Dropzone for file uploads
- CSS3 for styling
- Modern ES6+ JavaScript
