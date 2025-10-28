import React from 'react';
import { useNotification } from '../context/AppContext';

// Компонент для відображення помилок
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { showError } = useNotification();

  React.useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('Error caught by boundary:', error, errorInfo);
      setHasError(true);
      setError(error);
      showError(`Application error: ${error.message}`);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []); // Видаляємо showError з залежностей

  if (hasError) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
          </div>
          <p className="text-gray-600 mb-4">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {error && (
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => setHasError(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

// Хук для обробки помилок
export const useErrorHandler = () => {
  const { showError } = useNotification();

  const handleError = React.useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.response?.status) {
      errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
    }
    
    showError(errorMessage);
  }, [showError]);

  const handleAsyncError = React.useCallback(async (asyncFn, context = '') => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};

// Компонент для відображення помилок валідації
export const ValidationError = ({ error, onRetry, onClear }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <div className="mt-3 flex space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            )}
            {onClear && (
              <button
                onClick={onClear}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear Error
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент для відображення помилок завантаження
export const LoadingError = ({ error, onRetry, onCancel }) => {
  if (!error) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Loading Error</h3>
          <p className="text-sm text-yellow-700 mt-1">{error}</p>
          <div className="mt-3 flex space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Retry
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
