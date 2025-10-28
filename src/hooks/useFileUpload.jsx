import { useState, useCallback, use } from 'react';

// React 19: Використовуємо новий API `use` для асинхронних операцій
// Хук для завантаження файлів
export const useFileUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const isValidFileType = useCallback((file) => {
    const validTypes = ['text/plain', 'text/csv'];
    const validExtensions = ['.txt', '.csv'];
    
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    return hasValidType || hasValidExtension;
  }, []);

  const parseFileContent = useCallback((content) => {
    // Підтримка різних форматів розділювачів
    const lines = content
      .split(/[\r\n,;|]+/) // Розділювачі: новий рядок, кома, крапка з комою, вертикальна риска
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return lines;
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return null;

    if (!isValidFileType(file)) {
      throw new Error('Invalid file type. Please upload a .txt or .csv file.');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File is too large. Please upload a file smaller than 5MB.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const urls = parseFileContent(content);
          
          if (urls.length === 0) {
            reject(new Error('No valid URLs found in the file.'));
            return;
          }

          if (urls.length > 1000) {
            reject(new Error('Too many URLs. Please upload a file with less than 1000 URLs.'));
            return;
          }

          setUploadedFileName(file.name);
          resolve(urls);
        } catch (error) {
          reject(new Error(`Failed to parse file: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file.'));
      };

      reader.readAsText(file);
    });
  }, [isValidFileType, parseFileContent]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length === 0) return null;

    const file = files[0];
    if (!isValidFileType(file)) {
      throw new Error('Invalid file type. Please upload a .txt or .csv file.');
    }

    // Створюємо подію для обробки файлу
    const syntheticEvent = {
      target: {
        files: [file]
      }
    };

    return handleFileUpload(syntheticEvent);
  }, [handleFileUpload, isValidFileType]);

  const clearUploadedFile = useCallback(() => {
    setUploadedFileName('');
  }, []);

  return {
    isDragOver,
    uploadedFileName,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearUploadedFile,
    isValidFileType
  };
};
