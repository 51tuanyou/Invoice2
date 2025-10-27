import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';

const productAnalysisTemplate = {
  role: "You are an expert in product information analysis.",
  request: "Analyze product information and extract the following information:",
  fields: [
    "Manufacturer name",
    "JAN code", 
    "Manufacturer model number",
    "Seller product code",
    "Product name",
    "Short product name * Enter product name within 64 bytes",
    "Product name Yomi * Enter product name reading in full-width Katakana",
    "Release date",
    "Manufacturer's suggested retail price",
    "Country of origin",
    "Standard warranty details",
    "Included accessories",
    "Product overview * Enter product description within 512 characters",
    "Package size_width * Enter in mm units, up to 1 decimal place",
    "Package size_depth * Enter in mm units, up to 1 decimal place", 
    "Package size_height * Enter in mm units, up to 1 decimal place",
    "Package weight * Enter in grams (g) units, numbers only, no decimals",
    "Product body size_width * Enter in mm units, up to 1 decimal place",
    "Product body size_depth * Enter in mm units, up to 1 decimal place",
    "Product body size_height * Enter in mm units, up to 1 decimal place",
    "Product body weight * Enter in grams (g) units, numbers only, no decimals",
    "Number of items per carton"
  ]
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('product-analysis');

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleCSVConversion = () => {
    if (!selectedFile) {
      alert('Please upload a PDF file first');
      return;
    }
    alert('CSV conversion functionality would be implemented here');
  };

  return (
    <div className="app">
      <div className="container">
        {/* Left Section - PDF Upload */}
        <div className="upload-section">
          <div className="section-header">
            <h2>Select PDF to upload</h2>
          </div>
          <div className="upload-area">
            <div 
              {...getRootProps()} 
              className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="upload-content">
                <p>Please upload PDF</p>
                {selectedFile && (
                  <div className="selected-file">
                    <p>Selected: {selectedFile.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Template Selection */}
        <div className="template-section">
          <div className="section-header">
            <h2>Select template:</h2>
          </div>
          
          <div className="template-dropdown">
            <select value={selectedTemplate} onChange={handleTemplateChange}>
              <option value="product-analysis">
                Analyze product information and extract key information such as price.
              </option>
            </select>
          </div>

          <div className="template-details">
            <div className="template-content">
              <h3>###Role</h3>
              <p>{productAnalysisTemplate.role}</p>
              
              <h3>###Request</h3>
              <p>{productAnalysisTemplate.request}</p>
              
              <ul>
                {productAnalysisTemplate.fields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
              
              <h3>###Product Information</h3>
            </div>
          </div>

          <button className="csv-button" onClick={handleCSVConversion}>
            Confirm conversion to CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
