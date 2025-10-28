import axios from 'axios';

// Google PageSpeed Insights API
const PAGE_SPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

// Функція для отримання API ключа з змінних середовища або локального конфігу
const getApiKey = () => {
  // Спочатку перевіряємо змінні середовища
  if (import.meta.env.VITE_GOOGLE_API_KEY) {
    return import.meta.env.VITE_GOOGLE_API_KEY;
  }
  
  // Якщо немає змінної середовища, повертаємо null
  // Користувач повинен буде ввести ключ вручну
  return null;
};

// Безпечне отримання очок з категорії
const getCategoryScore = (category) => {
  return category && category.score ? category.score * 100 : 0;
};

// Безпечне отримання значення з аудиту
const getAuditValue = (audit) => {
  return audit && audit.displayValue ? audit.displayValue : 'N/A';
};

// Функція для перевірки PageSpeed
export const checkPageSpeed = async (url, apiKey = null) => {
  try {
    const key = apiKey || getApiKey();
    
    if (!key) {
      throw new Error('Google API key is required. Please provide your API key.');
    }

    // Паралельні запити для mobile та desktop
    const [mobileResponse, desktopResponse] = await Promise.all([
      axios.get(PAGE_SPEED_API_URL, {
        params: {
          url: url,
          key: key,
          strategy: 'mobile',
          category: ['performance', 'accessibility', 'best-practices', 'seo']
        }
      }),
      axios.get(PAGE_SPEED_API_URL, {
        params: {
          url: url,
          key: key,
          strategy: 'desktop',
          category: ['performance', 'accessibility', 'best-practices', 'seo']
        }
      })
    ]);

    // Обробка результатів
    const processResponse = (response) => {
      const lighthouse = response.data.lighthouseResult;
      
      // Безпечне отримання категорій
      const categories = lighthouse.categories || {};
      const audits = lighthouse.audits || {};
      
      return {
        // Основні метрики
        performanceScore: getCategoryScore(categories.performance),
        accessibilityScore: getCategoryScore(categories.accessibility),
        bestPracticesScore: getCategoryScore(categories['best-practices']),
        seoScore: getCategoryScore(categories.seo),
        
        // Core Web Vitals
        firstContentfulPaint: getAuditValue(audits['first-contentful-paint']),
        largestContentfulPaint: getAuditValue(audits['largest-contentful-paint']),
        cumulativeLayoutShift: getAuditValue(audits['cumulative-layout-shift']),
        firstInputDelay: getAuditValue(audits['max-potential-fid']),
        
        // Додаткові метрики
        speedIndex: getAuditValue(audits['speed-index']),
        totalBlockingTime: getAuditValue(audits['total-blocking-time']),
        timeToInteractive: getAuditValue(audits['interactive']),
        
        // Рекомендації - фільтруємо тільки ті, що існують
        opportunities: categories.performance && categories.performance.auditRefs
          ? categories.performance.auditRefs
              .filter(ref => audits[ref.id] && audits[ref.id].score !== null && audits[ref.id].score < 0.9)
              .map(ref => ({
                id: ref.id,
                title: audits[ref.id].title || 'Unknown',
                description: audits[ref.id].description || '',
                score: audits[ref.id].score ? audits[ref.id].score * 100 : 0,
                displayValue: audits[ref.id].displayValue || null
              }))
          : [],
        
        // Помилки - фільтруємо тільки ті, що існують
        diagnostics: categories.performance && categories.performance.auditRefs
          ? categories.performance.auditRefs
              .filter(ref => audits[ref.id] && audits[ref.id].score !== null && audits[ref.id].score < 0.5)
              .map(ref => ({
                id: ref.id,
                title: audits[ref.id].title || 'Unknown',
                description: audits[ref.id].description || '',
                score: audits[ref.id].score ? audits[ref.id].score * 100 : 0
              }))
          : []
      };
    };

    return {
      url,
      mobile: processResponse(mobileResponse),
      desktop: processResponse(desktopResponse),
      timestamp: new Date().toISOString(),
      link: `https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}`
    };

  } catch (error) {
    console.error('PageSpeed API Error:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Invalid URL or API key');
    } else if (error.response?.status === 403) {
      throw new Error('API key quota exceeded or invalid');
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    
    throw new Error(`Failed to check PageSpeed: ${error.message}`);
  }
};

// Функція для масової перевірки URL
export const checkMultiplePageSpeed = async (urls, apiKey, batchSize = 5, delay = 2000, onProgress = null) => {
  const results = [];
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    
    console.log(`Checking PageSpeed batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(urls.length / batchSize)} (${batch.length} URLs with parallel mobile/desktop requests)`);
    
    const batchPromises = batch.map(async (url, index) => {
      const globalIndex = i + index;
      
      // Викликаємо callback для оновлення прогресу
      if (onProgress) {
        onProgress({
          currentUrl: url,
          currentIndex: globalIndex,
          totalUrls: urls.length
        });
      }
      
      try {
        console.log(`Starting parallel mobile/desktop check for: ${url}`);
        const result = await checkPageSpeed(url, apiKey);
        
        // Викликаємо callback для завершеного URL
        if (onProgress) {
          onProgress({
            completedUrl: result,
            currentIndex: globalIndex,
            totalUrls: urls.length
          });
        }
        
        return result;
      } catch (error) {
        console.error(`Error checking ${url}:`, error.message);
        const failedResult = {
          url,
          error: error.message,
          timestamp: new Date().toISOString()
        };
        
        // Викликаємо callback для невдалого URL
        if (onProgress) {
          onProgress({
            failedUrl: failedResult,
            currentIndex: globalIndex,
            totalUrls: urls.length
          });
        }
        
        return failedResult;
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    console.log(`Completed batch ${Math.floor(i / batchSize) + 1}. Successful: ${batchResults.filter(r => !r.error).length}, Errors: ${batchResults.filter(r => r.error).length}`);
    
    // Затримка між батчами для уникнення лімітів API
    if (i + batchSize < urls.length) {
      console.log(`Waiting ${delay}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
};
