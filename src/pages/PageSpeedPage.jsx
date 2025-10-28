import React, { useRef } from 'react';
import { usePageSpeedValidator } from '../hooks/usePageSpeedValidator';
import { useFileUpload } from '../hooks/useFileUpload';
import { useNotification } from '../context/AppContext';
import FileUploader from '../components/FileUploader';
import ControlButtons from '../components/ControlButtons';
import PageSpeedResult from '../components/PageSpeedResult';
import StatisticsGrid from '../components/StatisticsGrid';
import ProcessPreview from '../components/ProcessPreview';
import { ValidationError } from '../components/ErrorBoundary';

const PageSpeedPage = () => {
  const fileInputRef = useRef(null);
  const {
    urls,
    setUrls,
    results,
    loading,
    error,
    apiKey,
    showApiKeyInput,
    validateUrls,
    exportToExcel,
    clearResults,
    clearUrls,
    handleApiKeyChange,
    toggleApiKeyInput,
    getOverallStats,
    currentUrl,
    currentIndex,
    completedUrls,
    failedUrls
  } = usePageSpeedValidator();

  const { uploadedFileName, clearUploadedFile } = useFileUpload();
  const { showError, showSuccess } = useNotification();

  const handleFileUpload = (urls) => {
    setUrls(urls);
    showSuccess(`Successfully loaded ${urls.length} URLs`);
  };

  const handleClearFile = () => {
    // Скидаємо input файлу через ref
    if (fileInputRef.current) {
      fileInputRef.current.clearInput();
    }
    clearUrls();
    clearUploadedFile();
  };

  const handleRetry = () => {
    if (urls.length > 0 && apiKey.trim()) {
      validateUrls();
    }
  };

  const handleClearError = () => {
    clearResults();
  };

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Google PageSpeed Insights
            </h1>
            <p className="text-xl text-green-100 mb-6 max-w-2xl mx-auto">
              Analyze website performance and get optimization recommendations using Google's PageSpeed Insights API. 
              Get detailed metrics for both mobile and desktop performance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Display */}
        <ValidationError 
          error={error} 
          onRetry={handleRetry}
          onClear={handleClearError}
        />

        {/* API Key Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Configuration</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You need a Google PageSpeed Insights API key to use this feature. 
              Get your API key from Google Cloud Console.
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">Google PageSpeed API Key Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You need a Google PageSpeed Insights API key to use this feature.
                </p>
              </div>
              <button
                onClick={toggleApiKeyInput}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors duration-200"
              >
                {showApiKeyInput ? 'Hide' : 'Enter API Key'}
              </button>
            </div>
            
            {showApiKeyInput && (
              <div className="mt-4">
                <input
                  type="password"
                  placeholder="Enter your Google PageSpeed API key"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-yellow-600 mt-2">
                  Get your API key from{' '}
                  <a 
                    href="https://console.developers.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-yellow-800"
                  >
                    Google Cloud Console
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Analyzing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload a text file containing URLs (one per line) to begin performance analysis. 
              Our tool will check each URL for mobile and desktop performance metrics.
            </p>
          </div>
          
          <FileUploader 
            ref={fileInputRef}
            onFileUpload={handleFileUpload}
            uploadedFileName={uploadedFileName}
            onClearFile={handleClearFile}
          />
          
          {urls.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-medium">
                  <strong>{urls.length}</strong> URLs loaded successfully
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="text-center mb-12">
          <ControlButtons
            validateUrls={validateUrls}
            exportToExcel={exportToExcel}
            loading={loading}
            hasResults={results.length > 0}
            hasUrls={urls.length > 0}
            onClearResults={clearResults}
            onClearUrls={handleClearFile}
          />
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mb-12">
            <StatisticsGrid stats={stats} title="PageSpeed Statistics" />
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">PageSpeed Results</h2>
              <p className="text-lg text-gray-600">
                Click on any result to view detailed metrics and recommendations for mobile and desktop performance.
              </p>
            </div>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <PageSpeedResult key={result.url || index} result={result} />
              ))}
            </div>
          </div>
        )}

      </div>
      
      {/* Process Preview */}
          <ProcessPreview
            isActive={loading}
            currentUrl={currentUrl}
            totalUrls={urls.length}
            currentIndex={currentIndex}
            completedUrls={completedUrls}
            failedUrls={failedUrls}
            allUrls={urls}
            processType="pagespeed"
          />
    </div>
  );
};

export default PageSpeedPage;