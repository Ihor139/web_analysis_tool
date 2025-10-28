// Application constants
export const APP_CONFIG = {
  NAME: 'Web Analysis Tool',
  VERSION: '2.0.0',
  DESCRIPTION: 'Professional web page analysis tool with W3C validation and PageSpeed insights',
  AUTHOR: 'Web Analysis Team',
  REPOSITORY: 'https://github.com/your-username/w3c-validator'
};

// API Configuration
export const API_CONFIG = {
  W3C_VALIDATOR: {
    BASE_URL: 'https://validator.w3.org/nu/',
    TIMEOUT: 30000,
    BATCH_SIZE: 50,
    DELAY: 1000
  },
  PAGE_SPEED: {
    BASE_URL: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
    TIMEOUT: 60000,
    BATCH_SIZE: 5,
    DELAY: 3000,
    STRATEGIES: ['mobile', 'desktop'],
    CATEGORIES: ['performance', 'accessibility', 'best-practices', 'seo']
  }
};

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_URLS: 1000,
  ALLOWED_TYPES: ['text/plain', 'text/csv'],
  ALLOWED_EXTENSIONS: ['.txt', '.csv'],
  SEPARATORS: ['\n', '\r\n', ',', ';', '|']
};

// UI Configuration
export const UI_CONFIG = {
  NOTIFICATION_DURATION: {
    SUCCESS: 5000,
    ERROR: 7000,
    WARNING: 6000,
    INFO: 4000
  },
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  }
};

// Validation Rules
export const VALIDATION_RULES = {
  URL: {
    PATTERN: /^https?:\/\/.+/,
    MAX_LENGTH: 2048
  },
  API_KEY: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100
  },
  BATCH_SIZE: {
    MIN: 1,
    MAX: 100
  },
  DELAY: {
    MIN: 100,
    MAX: 10000
  }
};

// Score Thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 50,
  POOR: 0
};

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File is too large. Please upload a file smaller than 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a .txt or .csv file.',
  NO_URLS_FOUND: 'No valid URLs found in the file.',
  TOO_MANY_URLS: 'Too many URLs. Please upload a file with less than 1000 URLs.',
  INVALID_URL: 'Invalid URL format.',
  API_KEY_REQUIRED: 'Google API key is required. Please provide your API key.',
  API_KEY_INVALID: 'Invalid API key.',
  API_QUOTA_EXCEEDED: 'API key quota exceeded or invalid.',
  TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  VALIDATION_FAILED: 'Validation failed. Please try again.',
  EXPORT_FAILED: 'Export failed. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully.',
  URLS_LOADED: 'URLs loaded successfully.',
  VALIDATION_COMPLETE: 'Validation completed successfully.',
  EXPORT_COMPLETE: 'Export completed successfully.',
  RESULTS_CLEARED: 'Results cleared successfully.',
  URLS_CLEARED: 'URLs cleared successfully.'
};

// Info Messages
export const INFO_MESSAGES = {
  DRAG_DROP: 'Drag and drop your file here, or click to browse',
  SUPPORTED_FORMATS: 'Supported formats: .txt, .csv',
  MAX_FILE_SIZE: 'Maximum file size: 5MB',
  MAX_URLS: 'Maximum URLs: 1000',
  API_KEY_INFO: 'Get your API key from Google Cloud Console',
  VALIDATION_IN_PROGRESS: 'Validation in progress...',
  EXPORT_IN_PROGRESS: 'Export in progress...'
};

// Warning Messages
export const WARNING_MESSAGES = {
  API_KEY_REQUIRED: 'Google PageSpeed API key is required for this feature.',
  LARGE_BATCH: 'Large batch may take longer to process.',
  SLOW_CONNECTION: 'Slow connection detected. Processing may take longer.'
};

// Excel Export Configuration
export const EXCEL_CONFIG = {
  W3C_COLUMNS: [
    'URL',
    'Error Count',
    'Warning Count',
    'Info Count',
    'Errors',
    'Warnings',
    'Info',
    'W3C Link',
    'Timestamp'
  ],
  PAGE_SPEED_COLUMNS: [
    'URL',
    'Status',
    'Error',
    'Mobile Performance',
    'Desktop Performance',
    'Mobile Accessibility',
    'Desktop Accessibility',
    'Mobile Best Practices',
    'Desktop Best Practices',
    'Mobile SEO',
    'Desktop SEO',
    'Mobile FCP',
    'Desktop FCP',
    'Mobile LCP',
    'Desktop LCP',
    'Mobile CLS',
    'Desktop CLS',
    'PageSpeed Report',
    'Timestamp'
  ],
  SHEET_NAMES: {
    W3C: 'W3C Validation Results',
    PAGE_SPEED: 'PageSpeed Results'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  API_KEY: 'pagespeed_api_key',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  SETTINGS: 'app_settings',
  LAST_RESULTS: 'last_validation_results'
};

// Routes
export const ROUTES = {
  HOME: '/',
  PAGE_SPEED: '/pagespeed',
  SETTINGS: '/settings',
  ABOUT: '/about'
};

// External Links
export const EXTERNAL_LINKS = {
  W3C_VALIDATOR: 'https://validator.w3.org/',
  PAGE_SPEED_INSIGHTS: 'https://pagespeed.web.dev/',
  GOOGLE_CLOUD_CONSOLE: 'https://console.developers.google.com/',
  REACT_DOCS: 'https://react.dev/',
  TAILWIND_DOCS: 'https://tailwindcss.com/',
  VITE_DOCS: 'https://vitejs.dev/'
};

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_LOGGING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_REPORTING: true,
  MOCK_API_RESPONSES: false
};

// Production Configuration
export const PROD_CONFIG = {
  ENABLE_LOGGING: false,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_REPORTING: true,
  MOCK_API_RESPONSES: false
};

// Get current configuration based on environment
export const getConfig = () => {
  return process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;
};
