import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import { useNotification } from '../context/AppContext';

const FileUploader = forwardRef(({ onFileUpload, uploadedFileName, onClearFile }, ref) => {
  const fileInputRef = useRef(null);
  const {
    isDragOver,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isValidFileType
  } = useFileUpload();

  const { showError, showSuccess } = useNotification();

  // Експортуємо ref для батьківського компонента
  useImperativeHandle(ref, () => ({
    clearInput: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }));

  const handleFileChange = async (event) => {
    try {
      const urls = await handleFileUpload(event);
      if (urls) {
        onFileUpload(urls);
        showSuccess(`Successfully loaded ${urls.length} URLs from file`);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDropEvent = async (event) => {
    try {
      const urls = await handleDrop(event);
      if (urls) {
        onFileUpload(urls);
        showSuccess(`Successfully loaded ${urls.length} URLs from file`);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const handleClearFile = () => {
    // Скидаємо значення input файлу
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClearFile();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
      >
        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Upload Text */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Upload URL List
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your file here, or click to browse
            </p>
          </div>

          {/* File Input */}
          <div>
            <label className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                Choose File
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* File Info */}
          <div className="text-xs text-gray-400">
            <p>Supported formats: .txt, .csv</p>
            <p>Maximum file size: 5MB</p>
            <p>Maximum URLs: 1000</p>
          </div>
        </div>
      </div>

      {/* Uploaded File Info */}
      {uploadedFileName && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-800">
                File uploaded: {uploadedFileName}
              </span>
            </div>
            <button
              onClick={handleClearFile}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;
  