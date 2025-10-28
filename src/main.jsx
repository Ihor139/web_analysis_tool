import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

// React 19: Використовуємо новий API для рендерингу
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
