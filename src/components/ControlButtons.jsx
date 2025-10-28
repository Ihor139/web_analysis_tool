import React from 'react';

const ControlButtons = ({ 
  validateUrls, 
  exportToExcel, 
  loading, 
  hasResults, 
  hasUrls,
  onClearResults,
  onClearUrls,
  showClearButtons = true
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {/* Validate Button */}
      <button
        onClick={validateUrls}
        disabled={loading || !hasUrls}
        className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
          loading || !hasUrls
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Validating...
          </div>
        ) : (
          'Start Validation'
        )}
      </button>

      {/* Export Button */}
      <button
        onClick={exportToExcel}
        disabled={!hasResults}
        className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
          !hasResults
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        }`}
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to Excel
        </div>
      </button>

      {/* Clear Buttons */}
      {showClearButtons && (
        <>
          {hasResults && (
            <button
              onClick={onClearResults}
              className="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-all duration-200"
            >
              Clear Results
            </button>
          )}
          
          {hasUrls && (
            <button
              onClick={onClearUrls}
              className="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-all duration-200"
            >
              Clear URLs
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ControlButtons;
  