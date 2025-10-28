import React, { useRef } from "react";
import { useW3CValidator } from "../hooks/useW3CValidator";
import { useFileUpload } from "../hooks/useFileUpload";
import { useNotification } from "../context/AppContext";
import FileUploader from "../components/FileUploader";
import AccordionItem from "../components/AccordionItem";
import ControlButtons from "../components/ControlButtons";
import StatisticsGrid from "../components/StatisticsGrid";
import ProcessPreview from "../components/ProcessPreview";
import { ValidationError } from "../components/ErrorBoundary";

const ValidatorPage = () => {
  const fileInputRef = useRef(null);
  const {
    urls,
    setUrls,
    results,
    loading,
    error,
    validateUrls,
    exportToExcel,
    clearResults,
    clearUrls,
    currentUrl,
    currentIndex,
    completedUrls,
    failedUrls
  } = useW3CValidator();

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
    if (urls.length > 0) {
      validateUrls();
    }
  };

  const handleClearError = () => {
    clearResults();
  };

  const getOverallStats = () => {
    if (results.length === 0) return null;

    const totalUrls = results.length;
    const totalErrors = results.reduce((sum, r) => {
      if (Array.isArray(r.errors)) return sum + r.errors.length;
      return sum;
    }, 0);
    const totalWarnings = results.reduce((sum, r) => {
      if (Array.isArray(r.warnings)) return sum + r.warnings.length;
      return sum;
    }, 0);
    const totalInfo = results.reduce((sum, r) => {
      if (Array.isArray(r.info)) return sum + r.info.length;
      return sum;
    }, 0);

    const successCount = results.filter(r => 
      Array.isArray(r.errors) && r.errors.length === 0
    ).length;

    return {
      totalUrls,
      successCount,
      errorCount: totalUrls - successCount,
      totalErrors,
      totalWarnings,
      totalInfo
    };
  };

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              W3C HTML Validator
            </h1>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Validate HTML pages for compliance with W3C standards. 
              Ensure your websites meet the highest quality standards.
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

        {/* File Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Validating</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload a text file containing URLs (one per line) to begin validation. 
              Our tool will check each URL against W3C standards.
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
            <StatisticsGrid stats={stats} title="Validation Statistics" />
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Validation Results</h2>
              <p className="text-lg text-gray-600">
                Click on any result to view detailed information about errors, warnings, and recommendations.
              </p>
            </div>
            
            <div className="space-y-4">
              {results.map((result) => (
                <AccordionItem key={result.url} {...result} />
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
            processType="validation"
          />
    </div>
  );
};

export default ValidatorPage;
