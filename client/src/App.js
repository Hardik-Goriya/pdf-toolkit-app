// client/src/App.js
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css';

// Reusable Dropzone Component
function FileDropzone({ onFileDrop, acceptedFileType, title }) {
  const onDrop = useCallback(acceptedFiles => {
    onFileDrop(acceptedFiles[0]); // Pass only the first file
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileType,
    multiple: false,
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyles}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the PDF here ...</p> : <p>{title}</p>}
    </div>
  );
}

function App() {
  const [fileToConvert, setFileToConvert] = useState(null);
  const [fileToSecure, setFileToSecure] = useState(null);
  const [fileToUnlock, setFileToUnlock] = useState(null);
  
  const [securePassword, setSecurePassword] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async (endpoint, file, password, outputNameGenerator) => {
    if (!file) {
      alert("Please drop a file first!");
      return;
    }
    if (password === '') { // Check for empty string if password is required
        alert("Please enter a password!");
        return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('pdfFile', file);
    if (password !== null) { // Only append password if it's not null
        formData.append('password', password);
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/${endpoint}`, formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', outputNameGenerator(file.name));
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(`Error during /api/${endpoint}:`, error);
      alert(error.response?.data || `An error occurred during the operation.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF Toolkit</h1>

        {/* --- PDF to Word Converter Section --- */}
        <div className="tool-section">
          <h2>1. PDF to Word Converter</h2>
          <FileDropzone
            onFileDrop={setFileToConvert}
            acceptedFileType={{ 'application/pdf': ['.pdf'] }}
            title="Drag 'n' drop a PDF to convert to Word"
          />
          {fileToConvert && <p className="file-name">Selected: {fileToConvert.name}</p>}
          <button onClick={() => handleApiCall('convert', fileToConvert, null, name => name.replace(/\.[^/.]+$/, "") + ".docx")} disabled={!fileToConvert || isLoading}>
            {isLoading ? 'Processing...' : 'Convert to Word'}
          </button>
        </div>

        {/* --- Secure PDF Section --- */}
        <div className="tool-section">
          <h2>2. Secure PDF with Password</h2>
          <FileDropzone
            onFileDrop={setFileToSecure}
            acceptedFileType={{ 'application/pdf': ['.pdf'] }}
            title="Drag 'n' drop a PDF to add a password"
          />
          {fileToSecure && (
            <>
              <p className="file-name">Selected: {fileToSecure.name}</p>
              <input
                type="password"
                placeholder="Enter new password"
                value={securePassword}
                onChange={(e) => setSecurePassword(e.target.value)}
                className="password-input"
              />
            </>
          )}
          <button onClick={() => handleApiCall('secure', fileToSecure, securePassword, name => name.replace(/\.[^/.]+$/, "") + "_secured.pdf")} disabled={!fileToSecure || !securePassword || isLoading}>
            {isLoading ? 'Processing...' : 'Set Password & Download'}
          </button>
        </div>
        
        {/* --- Remove PDF Password Section --- */}
        <div className="tool-section">
          <h2>3. Remove PDF Password</h2>
          <FileDropzone
            onFileDrop={setFileToUnlock}
            acceptedFileType={{ 'application/pdf': ['.pdf'] }}
            title="Drag 'n' drop a PDF to remove its password"
          />
          {fileToUnlock && (
            <>
              <p className="file-name">Selected: {fileToUnlock.name}</p>
              <input
                type="password"
                placeholder="Enter current password"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                className="password-input"
              />
            </>
          )}
          <button onClick={() => handleApiCall('unlock', fileToUnlock, unlockPassword, name => name.replace(/\.[^/.]+$/, "") + "_unlocked.pdf")} disabled={!fileToUnlock || !unlockPassword || isLoading}>
            {isLoading ? 'Processing...' : 'Remove Password & Download'}
          </button>
        </div>

      </header>
    </div>
  );
}

const dropzoneStyles = {
  border: '2px dashed #61dafb',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: '15px',
  backgroundColor: '#3a3f4a',
};

export default App;