import { useState, useCallback, use } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// React 19: Використовуємо новий API `use` для асинхронних операцій
// Хук для W3C валідації
export const useW3CValidator = () => {
  const [urls, setUrls] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Стан для превью процесу
  const [currentUrl, setCurrentUrl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedUrls, setCompletedUrls] = useState([]);
  const [failedUrls, setFailedUrls] = useState([]);

  const validateUrl = useCallback(async (url) => {
    try {
      const response = await axios.get("https://validator.w3.org/nu/", {
        params: { doc: url, out: "json" },
        timeout: 30000 // 30 секунд таймаут
      });

      const { messages } = response.data;

      return {
        url,
        errors: messages.filter((m) => m.type === "error"),
        warnings: messages.filter((m) => m.type === "warning"),
        info: messages.filter((m) => m.type === "info"),
        link: `https://validator.w3.org/nu/?doc=${encodeURIComponent(url)}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`W3C validation error for ${url}:`, error);
      
      if (error.response?.status === 429) {
        return {
          url,
          errors: [{ message: "Too Many Requests (429)", extract: "", type: "error" }],
          warnings: [],
          info: [],
          link: `https://validator.w3.org/nu/?doc=${encodeURIComponent(url)}`,
          timestamp: new Date().toISOString()
        };
      }
      
      if (error.response?.status === 415) {
        return {
          url,
          errors: [{ message: "Unsupported Media Type (415)", extract: "", type: "error" }],
          warnings: [],
          info: [],
          link: `https://validator.w3.org/nu/?doc=${encodeURIComponent(url)}`,
          timestamp: new Date().toISOString()
        };
      }
      
      return {
        url,
        errors: [{ message: `Validation failed: ${error.message}`, extract: "", type: "error" }],
        warnings: [],
        info: [],
        link: "#",
        timestamp: new Date().toISOString()
      };
    }
  }, []);

  const validateUrlsInBatches = useCallback(async (urls, batchSize = 50, delay = 7000) => {
    const results = [];
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(urls.length / batchSize);

      console.log(`W3C Validating batch ${batchNumber} of ${totalBatches} (${batch.length} URLs)`);

      try {
        const batchResults = await Promise.all(batch.map(async (url, index) => {
          const globalIndex = i + index;
          setCurrentUrl(url);
          setCurrentIndex(globalIndex);
          
          try {
            const result = await validateUrl(url);
            setCompletedUrls(prev => [...prev, result]);
            return result;
          } catch (error) {
            const failedResult = {
              url,
              error: error.message,
              timestamp: new Date().toISOString()
            };
            setFailedUrls(prev => [...prev, failedResult]);
            return failedResult;
          }
        }));
        
        results.push(...batchResults);
        
        console.log(`W3C Batch ${batchNumber} completed. Successful: ${batchResults.length}`);
      } catch (error) {
        console.error(`W3C Batch ${batchNumber} failed:`, error);
        // Додаємо помилки для всіх URL в батчі
        batch.forEach((url, index) => {
          const globalIndex = i + index;
          const failedResult = {
            url,
            error: `Batch validation failed: ${error.message}`,
            timestamp: new Date().toISOString()
          };
          setFailedUrls(prev => [...prev, failedResult]);
          results.push({
            url,
            errors: [{ message: `Batch validation failed: ${error.message}`, extract: "", type: "error" }],
            warnings: [],
            info: [],
            link: "#",
            timestamp: new Date().toISOString()
          });
        });
      }

      // Затримка між батчами
      if (i + batchSize < urls.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    
    return results;
  }, [validateUrl]);

  const validateUrls = useCallback(async () => {
    if (urls.length === 0) {
      setError('No URLs to validate');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentUrl(null);
    setCurrentIndex(0);
    setCompletedUrls([]);
    setFailedUrls([]);
    
    try {
      const resultsArray = await validateUrlsInBatches(urls, 50, 1000);
      setResults(resultsArray);
    } catch (error) {
      setError(`Validation failed: ${error.message}`);
    } finally {
      setLoading(false);
      setCurrentUrl(null);
    }
  }, [urls, validateUrlsInBatches]);

  const exportToExcel = useCallback(() => {
    if (results.length === 0) {
      setError('No results to export');
      return;
    }

    try {
      const excelData = results.map(({ url, errors, warnings, info, link }) => ({
        URL: url,
        'Error Count': Array.isArray(errors) ? errors.length : 0,
        'Warning Count': Array.isArray(warnings) ? warnings.length : 0,
        'Info Count': Array.isArray(info) ? info.length : 0,
        Errors: Array.isArray(errors) ? errors.map(e => e.message).join('; ') : errors,
        Warnings: Array.isArray(warnings) ? warnings.map(w => w.message).join('; ') : warnings,
        Info: Array.isArray(info) ? info.map(i => i.message).join('; ') : info,
        'W3C Link': link,
        Timestamp: new Date().toISOString()
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "W3C Validation Results");
      
      const fileName = `w3c_validation_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      setError(`Export failed: ${error.message}`);
    }
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

  return {
    urls,
    setUrls,
    results,
    loading,
    error,
    validateUrls,
    exportToExcel,
    clearResults,
    clearUrls,
    setError,
    // Стан для превью процесу
    currentUrl,
    currentIndex,
    completedUrls,
    failedUrls
  };
};
