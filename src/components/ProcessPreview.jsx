import React, { useState, useEffect, useRef } from 'react';

const ProcessPreview = ({ 
  isActive, 
  currentUrl, 
  totalUrls, 
  currentIndex, 
  completedUrls = [], 
  failedUrls = [],
  allUrls = [], // Додаємо всі URL
  processType = 'validation' // 'validation' or 'pagespeed'
}) => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState(null);
  const scrollRef = useRef(null);

  // Показуємо термінал тільки коли процес активний
  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      // Очищаємо таймер закриття якщо процес знову активний
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        setAutoCloseTimer(null);
      }
    } else if (isVisible && !isActive) {
      // Процес завершився, встановлюємо таймер для автоматичного закриття
      const timer = setTimeout(() => {
        setIsVisible(false);
        setLogs([]); // Очищаємо логи при закритті
      }, 3000); // Закриваємо через 3 секунди
      setAutoCloseTimer(timer);
    }
  }, [isActive, isVisible]); // Видаляємо autoCloseTimer з залежностей

  // Очищаємо таймер при розмонтуванні компонента
  useEffect(() => {
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, []); // Видаляємо autoCloseTimer з залежностей

  // Додаємо всі URL до логів при початку процесу
  useEffect(() => {
    if (isActive && allUrls.length > 0 && logs.length === 0) {
      const timestamp = new Date().toLocaleTimeString();
      const initialLogs = allUrls.map((url, index) => ({
        id: `url-${index}-${timestamp}`,
        timestamp,
        url: url, // Використовуємо реальний URL
        index: index + 1,
        total: allUrls.length,
        type: 'processing'
      }));
      setLogs(initialLogs);
    }
  }, [isActive, allUrls, logs.length]);

  // Видаляємо завершені URL з логів за індексом
  useEffect(() => {
    if (completedUrls.length > 0) {
      setLogs(prev => {
        // Видаляємо останній завершений URL
        return prev.slice(0, -1);
      });
    }
  }, [completedUrls]);

  // Видаляємо невдалі URL з логів за індексом
  useEffect(() => {
    if (failedUrls.length > 0) {
      setLogs(prev => {
        // Видаляємо останній невдалий URL
        return prev.slice(0, -1);
      });
    }
  }, [failedUrls]);

  // Автоматична прокрутка до низу при нових логах
  useEffect(() => {
    if (scrollRef.current && logs.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getProcessIcon = (type) => {
    switch (type) {
      case 'processing':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-blue-400 text-xs">PROCESSING</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getProcessText = (type) => {
    switch (type) {
      case 'validation':
        return 'W3C Validation';
      case 'pagespeed':
        return 'PageSpeed Analysis';
      default:
        return 'Processing';
    }
  };

  const getStatusText = (log) => {
    switch (log.type) {
      case 'processing':
        return `Processing ${log.url}...`;
      default:
        return '';
    }
  };

  // Не показуємо термінал якщо процес не активний
  if (!isVisible || !isActive) return null;

      return (
        <div className="fixed bottom-4 right-4 w-96 z-50">
          <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm font-mono">
                {getProcessText(processType)} Process
              </span>
            </div>
            <div className="text-gray-400 text-xs font-mono">
              {currentIndex + 1}/{totalUrls}
            </div>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="bg-gray-900 p-4 h-40 overflow-hidden">
          <div 
            ref={scrollRef}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            {logs.length === 0 ? (
              <div className="text-gray-500 text-sm font-mono">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                  <span>Starting {getProcessText(processType).toLowerCase()}...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div 
                    key={log.id} 
                    className="text-sm font-mono transition-all duration-300 text-blue-300 animate-pulse"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {getProcessIcon(log.type)}
                        <span className="text-gray-500 text-xs">
                          [{log.timestamp}]
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-300 ml-4 text-xs">
                      {getStatusText(log)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-xs font-mono">
              Processing {logs.length} URLs...
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-xs font-mono">
                {completedUrls.length + failedUrls.length} completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessPreview;
