import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import PDFPreview from './components/PDFPreview';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [pdfImages, setPdfImages] = useState([]);
  const [templateContent, setTemplateContent] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editedTemplateContent, setEditedTemplateContent] = useState('');

  // Fixed templates
  const templates = [
    {
      id: 'template1',
      name: 'Extract Apple invoice data'
    },
    {
      id: 'template2', 
      name: 'Extract Lenovo invoice data'
    },
    {
      id: 'template3',
      name: 'Extract Picture data'
    }
  ];

  // Load template content from markdown files
  useEffect(() => {
    loadTemplateContent(selectedTemplate);
  }, [selectedTemplate]);

  // Auto-enter edit mode for Extract Picture data template
  useEffect(() => {
    if (selectedTemplate === 'template3' && templateContent) {
      setEditedTemplateContent(templateContent);
      setIsEditingTemplate(true);
    } else if (selectedTemplate !== 'template3') {
      setIsEditingTemplate(false);
    }
  }, [selectedTemplate, templateContent]);

  const loadTemplateContent = async (templateId) => {
    try {
      const response = await fetch(`/templates/${templateId}.md`);
      if (response.ok) {
        const content = await response.text();
        setTemplateContent(content);
      } else {
        console.error('Failed to load template content');
        setTemplateContent('Template content not available');
      }
    } catch (error) {
      console.error('Error loading template content:', error);
      setTemplateContent('Template content not available');
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple: false
  });

  const handleSelectButtonClick = () => {
    // Trigger file input click
    const input = document.querySelector('input[type="file"]');
    if (input) {
      input.click();
    }
  };

  const handleImagesGenerated = (images) => {
    setPdfImages(images);
  };

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleCSVConversion = async () => {
    if (!selectedFile) {
      alert(t('uploadError'));
      return;
    }
    
    // Check if it's a PDF file and needs processing
    const isPdfFile = selectedFile.type === 'application/pdf';
    if (isPdfFile && pdfImages.length === 0) {
      alert('Please wait for PDF to be processed first');
      return;
    }

    // Get API key from environment variable or prompt
    // Only use REACT_APP_OPENAI_API_KEY, ignore system OPENAI_API_KEY
    let apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    // Check for runtime environment variables (Docker)
    if (window._env_ && window._env_.REACT_APP_OPENAI_API_KEY) {
      apiKey = window._env_.REACT_APP_OPENAI_API_KEY;
    }
    
    if (!apiKey || apiKey === 'your_openai_api_key_here' || !apiKey.startsWith('sk-')) {
      // Check sessionStorage first (remembers only for current tab session)
      const sessionApiKey = sessionStorage.getItem('openai_api_key');
      if (sessionApiKey && sessionApiKey.startsWith('sk-')) {
        apiKey = sessionApiKey;
      } else {
        apiKey = prompt('Please enter your OpenAI API key:');
        if (!apiKey) {
          alert('OpenAI API key is required');
          return;
        }
        // Save to sessionStorage for current tab session only
        sessionStorage.setItem('openai_api_key', apiKey);
      }
    }

    console.log('🚀 Starting OCR processing...');
    console.log('📄 Selected file:', selectedFile.name);
    console.log('📋 Selected template:', selectedTemplate);
    console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Not provided');
    
    setIsProcessing(true);
    
    try {
      console.log('⚙️ Preparing OpenAI API request...');

      let imageBase64;
      
      if (isPdfFile) {
        console.log('🖼️ Converting PDF to image...');
        // Convert first image to base64
        imageBase64 = pdfImages[0].split(',')[1];
        console.log('📊 Image size:', Math.round(imageBase64.length / 1024), 'KB');
      } else {
        console.log('🖼️ Processing image file directly...');
        // Convert image file to base64
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result.split(',')[1];
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
        console.log('📊 Image size:', Math.round(imageBase64.length / 1024), 'KB');
      }
      
      // Use edited content if in editing mode, otherwise use original template content
      const promptContent = isEditingTemplate ? editedTemplateContent : templateContent;
      
      // Prepare the request payload
      const requestPayload = {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: promptContent
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
      };

      console.log('📝 Complete Prompt Information:');
      console.log('=====================================');
      console.log('Template Content:');
      console.log(templateContent);
      console.log('=====================================');
      console.log('Request Payload:', {
        ...requestPayload,
        messages: [
          {
            ...requestPayload.messages[0],
            content: [
              requestPayload.messages[0].content[0],
              {
                ...requestPayload.messages[0].content[1],
                image_url: {
                  url: `data:image/jpeg;base64,[${imageBase64.length} characters]`
                }
              }
            ]
          }
        ]
      });
      
      console.log('🤖 Calling OpenAI Vision API with fetch...');
      console.log('⏳ Processing started at:', new Date().toLocaleTimeString());
      
      // Call OpenAI Vision API using fetch
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      console.log('✅ OpenAI API response received at:', new Date().toLocaleTimeString());
      console.log('📊 Response usage:', result.usage);
      console.log('📝 Raw extracted text:');
      console.log('=====================================');
      console.log(result.choices[0].message.content);
      console.log('=====================================');

      const extractedText = result.choices[0].message.content;
      
      console.log('🔍 Parsing extracted data...');
      // Parse the extracted data
      const parsedData = parseExtractedData(extractedText);
      console.log('📋 Parsed data:', parsedData);
      
      setExtractedData(parsedData);
      setEditableData(parsedData);
      
      console.log('🎉 OCR processing completed successfully!');
      
    } catch (error) {
      console.error('❌ OCR Error Details:');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.response) {
        console.error('API Response status:', error.response.status);
        console.error('API Response data:', error.response.data);
      }
      
      if (error.code) {
        console.error('Error code:', error.code);
      }
      
      alert(`OCR processing failed: ${error.message}\nCheck console for detailed error information.`);
    } finally {
      setIsProcessing(false);
      console.log('🏁 Processing finished at:', new Date().toLocaleTimeString());
    }
  };

  const parseExtractedData = (text) => {
    // Parse the extracted text into structured data
    // This is a simplified parser - you might need to adjust based on actual OpenAI response format
    const lines = text.split('\n');
    const data = {};
    
    lines.forEach(line => {
      if (line.includes('|') && !line.includes('Field Name')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        if (parts.length >= 2) {
          const fieldName = parts[0];
          const value = parts[1] || '';
          data[fieldName] = value;
        }
      }
    });
    
    return data;
  };

  const handleFieldEdit = (fieldName, value) => {
    setEditableData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleEditTemplate = () => {
    setEditedTemplateContent(templateContent);
    setIsEditingTemplate(true);
  };

  const handleExitEdit = () => {
    setIsEditingTemplate(false);
  };

  const handleDownloadCSV = () => {
    if (!editableData || Object.keys(editableData).length === 0) {
      alert('No data to download');
      return;
    }

    // Convert to CSV format
    const csvContent = Object.entries(editableData)
      .map(([key, value]) => `"${key}","${value}"`)
      .join('\n');
    
    const csvHeader = 'Field Name,Extracted Value or Note\n';
    const fullCsv = csvHeader + csvContent;
    
    // Download CSV file
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'extracted_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📥 CSV file downloaded successfully');
    console.log('📊 Downloaded data:', editableData);
  };

  return (
    <div className="app">
      <LanguageSwitcher />
      <div className="container">
        {/* Left Section - PDF Upload and Preview */}
        <div className="upload-section">
          <button className="select-button" onClick={handleSelectButtonClick}>
            {t('selectPdfButton')}
          </button>
          <div className="upload-area">
            {selectedFile ? (
              selectedFile.type === 'application/pdf' ? (
                <PDFPreview 
                  file={selectedFile} 
                  onImagesGenerated={handleImagesGenerated}
                />
              ) : (
                <div className="image-preview">
                  <h3>Image Preview</h3>
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                  />
                  <p>File: {selectedFile.name}</p>
                  <p>Type: {selectedFile.type}</p>
                  <p>Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              )
            ) : (
              <div 
                {...getRootProps()} 
                className={`dropzone ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="upload-content">
                  <p>{t('uploadPrompt')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Template Selection */}
        <div className="template-section">
          <label className="template-label">
            {t('templateLabel')}
          </label>
          
          <div className="template-dropdown">
            <select 
              value={selectedTemplate} 
              onChange={handleTemplateChange}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className={`template-details ${extractedData ? 'compressed' : ''}`}>
            <div className="template-content">
              {isEditingTemplate ? (
                <div className="template-editor">
                  <textarea
                    value={editedTemplateContent}
                    onChange={(e) => setEditedTemplateContent(e.target.value)}
                    className="template-textarea"
                    rows={20}
                    placeholder="Enter template content..."
                  />
                  <div className="template-edit-controls">
                    <button className="exit-edit-button" onClick={handleExitEdit}>
                      {t('exitEdit')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="template-display">
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                    {templateContent}
                  </pre>
                  <button className="edit-template-button" onClick={handleEditTemplate}>
                    {t('editTemplate')}
                  </button>
                </div>
              )}
            </div>
            <button className="csv-button" onClick={handleCSVConversion} disabled={isProcessing}>
              {isProcessing ? t('processing') : t('csvButton')}
            </button>
          </div>

          {/* Extracted Data Display */}
          {extractedData && (
            <div className="extracted-data-section">
              <h3>Extracted Data</h3>
              <div className="data-table">
                {Object.entries(editableData).map(([fieldName, value]) => (
                  <div key={fieldName} className="data-row">
                    <div className="field-name">{fieldName}</div>
                    <div className="field-value">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleFieldEdit(fieldName, e.target.value)}
                        className="editable-field"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Download CSV Button */}
      {extractedData && (
        <button className="download-csv-button" onClick={handleDownloadCSV}>
          {t('downloadCsvButton')}
        </button>
      )}
    </div>
  );
}

export default App;
