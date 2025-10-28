import React, { createContext, useContext, useReducer, use } from 'react';

// React 19: Використовуємо новий API `use` для асинхронних операцій
// Типи дій
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE'
};

// Початковий стан
const initialState = {
  loading: false,
  error: null,
  notification: null,
  theme: 'light',
  language: 'en',
  settings: {
    batchSize: 5,
    delay: 2000,
    autoExport: false,
    showAdvancedMetrics: true
  }
};

// Редюсер
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        notification: null
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ActionTypes.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
        error: null
      };
    
    case ActionTypes.CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: null
      };
    
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    
    case ActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
    
    default:
      return state;
  }
};

// Контекст
const AppContext = createContext();

// Провайдер
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setLoading: (loading) => 
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    
    setError: (error) => 
      dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    
    clearError: () => 
      dispatch({ type: ActionTypes.CLEAR_ERROR }),
    
    setNotification: (notification) => 
      dispatch({ type: ActionTypes.SET_NOTIFICATION, payload: notification }),
    
    clearNotification: () => 
      dispatch({ type: ActionTypes.CLEAR_NOTIFICATION }),
    
    setTheme: (theme) => 
      dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    
    setLanguage: (language) => 
      dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для використання контексту
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Хук для показу повідомлень
export const useNotification = () => {
  const { setNotification, clearNotification, notification } = useApp();

  const showSuccess = (message) => {
    setNotification({ type: 'success', message });
    setTimeout(clearNotification, 5000);
  };

  const showError = (message) => {
    setNotification({ type: 'error', message });
    setTimeout(clearNotification, 7000);
  };

  const showInfo = (message) => {
    setNotification({ type: 'info', message });
    setTimeout(clearNotification, 4000);
  };

  const showWarning = (message) => {
    setNotification({ type: 'warning', message });
    setTimeout(clearNotification, 6000);
  };

  return {
    notification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    clearNotification
  };
};
