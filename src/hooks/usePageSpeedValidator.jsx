import { useState, useCallback, use } from 'react';
import { checkMultiplePageSpeed } from '../services/pageSpeedService';
import * as XLSX from 'xlsx';

// React 19: Використовуємо новий API `use` для асинхронних операцій
// Хук для PageSpeed валідації
export const usePageSpeedValidator = () => {
  const [urls, setUrls] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('AIzaSyCyvddUbtU5SYBWMW_-_UFODWK94A4Y7TQ');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  // Стан для превью процесу
  const [currentUrl, setCurrentUrl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedUrls, setCompletedUrls] = useState([]);
  const [failedUrls, setFailedUrls] = useState([]);

  const isValidUrl = useCallback((string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  const validateUrls = useCallback(async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Google PageSpeed API key');
      return;
    }

    if (urls.length === 0) {
      setError('Please upload a file with URLs first');
      return;
    }

    // Валідація URL
    const invalidUrls = urls.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      setError(`Invalid URLs found: ${invalidUrls.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentUrl(null);
    setCurrentIndex(0);
    setCompletedUrls([]);
    setFailedUrls([]);
    
    try {
      const resultsArray = await checkMultiplePageSpeed(urls, apiKey.trim(), 3, 3000, (progress) => {
        if (progress.currentUrl) {
          setCurrentUrl(progress.currentUrl);
          setCurrentIndex(progress.currentIndex);
        }
        if (progress.completedUrl) {
          setCompletedUrls(prev => [...prev, progress.completedUrl]);
        }
        if (progress.failedUrl) {
          setFailedUrls(prev => [...prev, progress.failedUrl]);
        }
      });
      setResults(resultsArray);
    } catch (error) {
      setError(`PageSpeed validation failed: ${error.message}`);
    } finally {
      setLoading(false);
      setCurrentUrl(null);
    }
  }, [urls, apiKey, isValidUrl]);

  const exportToExcel = useCallback(() => {
    if (results.length === 0) {
      setError('No results to export');
      return;
    }

    try {
      const excelData = results.map((result) => {
        if (result.error) {
          return {
            URL: result.url,
            Status: 'Error',
            Error: result.error,
            'Mobile Performance': 'N/A',
            'Desktop Performance': 'N/A',
            'Mobile Accessibility': 'N/A',
            'Desktop Accessibility': 'N/A',
            'Mobile Best Practices': 'N/A',
            'Desktop Best Practices': 'N/A',
            'Mobile SEO': 'N/A',
            'Desktop SEO': 'N/A',
            'PageSpeed Report': 'N/A',
            Timestamp: result.timestamp || new Date().toISOString()
          };
        }

        return {
          URL: result.url,
          Status: 'Success',
          Error: '',
          'Mobile Performance': Math.round(result.mobile?.performanceScore || 0),
          'Desktop Performance': Math.round(result.desktop?.performanceScore || 0),
          'Mobile Accessibility': Math.round(result.mobile?.accessibilityScore || 0),
          'Desktop Accessibility': Math.round(result.desktop?.accessibilityScore || 0),
          'Mobile Best Practices': Math.round(result.mobile?.bestPracticesScore || 0),
          'Desktop Best Practices': Math.round(result.desktop?.bestPracticesScore || 0),
          'Mobile SEO': Math.round(result.mobile?.seoScore || 0),
          'Desktop SEO': Math.round(result.desktop?.seoScore || 0),
          'Mobile FCP': result.mobile?.firstContentfulPaint || 'N/A',
          'Desktop FCP': result.desktop?.firstContentfulPaint || 'N/A',
          'Mobile LCP': result.mobile?.largestContentfulPaint || 'N/A',
          'Desktop LCP': result.desktop?.largestContentfulPaint || 'N/A',
          'Mobile CLS': result.mobile?.cumulativeLayoutShift || 'N/A',
          'Desktop CLS': result.desktop?.cumulativeLayoutShift || 'N/A',
          'PageSpeed Report': result.link || 'N/A',
          Timestamp: result.timestamp || new Date().toISOString()
        };
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'PageSpeed Results');
      
      const fileName = `pagespeed_results_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      setError(`Export failed: ${error.message}`);
    }
  }, [results]);

  const getOverallStats = useCallback(() => {
    if (results.length === 0) return null;

    const successfulResults = results.filter(r => !r.error);
    const totalUrls = results.length;
    const successCount = successfulResults.length;
    const errorCount = totalUrls - successCount;

    const avgMobilePerformance = successfulResults.length > 0 
      ? successfulResults.reduce((sum, r) => sum + (r.mobile?.performanceScore || 0), 0) / successfulResults.length
      : 0;

    const avgDesktopPerformance = successfulResults.length > 0
      ? successfulResults.reduce((sum, r) => sum + (r.desktop?.performanceScore || 0), 0) / successfulResults.length
      : 0;

    const avgMobileAccessibility = successfulResults.length > 0
      ? successfulResults.reduce((sum, r) => sum + (r.mobile?.accessibilityScore || 0), 0) / successfulResults.length
      : 0;

    const avgDesktopAccessibility = successfulResults.length > 0
      ? successfulResults.reduce((sum, r) => sum + (r.desktop?.accessibilityScore || 0), 0) / successfulResults.length
      : 0;

    return {
      totalUrls,
      successCount,
      errorCount,
      avgMobilePerformance: Math.round(avgMobilePerformance),
      avgDesktopPerformance: Math.round(avgDesktopPerformance),
      avgMobileAccessibility: Math.round(avgMobileAccessibility),
      avgDesktopAccessibility: Math.round(avgDesktopAccessibility)
    };
  }, [results]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setCurrentUrl(null);
    setCurrentIndex(0);
    setCompletedUrls([]);
    setFailedUrls([]);
  }, []);

  const clearUrls = useCallback(() => {
    setUrls([]);
    setResults([]);
    setError(null);
    setCurrentUrl(null);
    setCurrentIndex(0);
    setCompletedUrls([]);
    setFailedUrls([]);
  }, []);

  const handleApiKeyChange = useCallback((event) => {
    setApiKey(event.target.value);
    setError(null);
  }, []);

  const toggleApiKeyInput = useCallback(() => {
    setShowApiKeyInput(!showApiKeyInput);
  }, [showApiKeyInput]);

  return {
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
    setError,
    // Стан для превью процесу
    currentUrl,
    currentIndex,
    completedUrls,
    failedUrls
  };
};
