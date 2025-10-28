import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ValidatorPage from "./pages/ValidatorPage";
import PageSpeedPage from "./pages/PageSpeedPage";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/index.css";

// React 19: Використовуємо новий API для метатегів
const App = () => {
  return (
    <AppProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Notification />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/validator" element={<ValidatorPage />} />
              <Route path="/pagespeed" element={<PageSpeedPage />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </AppProvider>
  );
};

export default App;
