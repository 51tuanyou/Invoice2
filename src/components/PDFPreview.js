import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './PDFPreview.css';

// Set up PDF.js worker with local file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFPreview = ({ file, onImagesGenerated }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (file) {
      convertPDFToImages(file);
    }
  }, [file]);

  const convertPDFToImages = async (pdfFile) => {
    setLoading(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const imagePromises = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        const imagePromise = renderTask.promise.then(() => {
          return canvas.toDataURL('image/png');
        });
        
        imagePromises.push(imagePromise);
      }

      const generatedImages = await Promise.all(imagePromises);
      setImages(generatedImages);
      onImagesGenerated && onImagesGenerated(generatedImages);
    } catch (error) {
      console.error('Error converting PDF to images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedImages(newSelected);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  if (loading) {
    return (
      <div className="pdf-preview loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Converting PDF to images...</p>
        </div>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="pdf-preview empty">
        <p>No PDF loaded</p>
      </div>
    );
  }

  return (
    <div className="pdf-preview">
      <div className="preview-header">
        <h3>PDF Preview ({images.length} pages)</h3>
        <div className="zoom-controls">
          <button onClick={handleZoomOut} disabled={zoom <= 0.5}>-</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} disabled={zoom >= 3}>+</button>
          <button onClick={handleResetZoom}>Reset</button>
        </div>
      </div>

      <div className="preview-main">
        <div className="image-container">
          <button 
            className="nav-button prev" 
            onClick={handlePrevious}
            disabled={images.length <= 1}
          >
            ‹
          </button>
          
          <div className="image-wrapper" style={{ transform: `scale(${zoom})` }}>
            <img
              src={images[currentIndex]}
              alt={`Page ${currentIndex + 1}`}
              className={`preview-image ${selectedImages.has(currentIndex) ? 'selected' : ''}`}
              onClick={() => handleImageClick(currentIndex)}
            />
          </div>
          
          <button 
            className="nav-button next" 
            onClick={handleNext}
            disabled={images.length <= 1}
          >
            ›
          </button>
        </div>

        <div className="thumbnail-strip">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''} ${selectedImages.has(index) ? 'selected' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                handleImageClick(index);
              }}
            >
              <img src={image} alt={`Page ${index + 1}`} />
              <span className="page-number">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="preview-footer">
        <div className="selection-info">
          {selectedImages.size > 0 && (
            <p>{selectedImages.size} page(s) selected</p>
          )}
        </div>
        <div className="page-info">
          Page {currentIndex + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
