import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Web Analysis Tool</h1>
                <p className="text-sm text-gray-500">Professional Web Validation</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/validator"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/validator' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              W3C Validator
            </Link>
            <Link
              to="/pagespeed"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/pagespeed' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              PageSpeed Insights
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/validator"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/validator' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              W3C Validator
            </Link>
            <Link
              to="/pagespeed"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/pagespeed' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              PageSpeed Insights
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
