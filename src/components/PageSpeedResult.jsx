import { useState } from 'react';

const PageSpeedResult = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mobile');

  if (result.error) {
    return (
      <div className="border border-red-300 rounded-md mb-2 bg-red-50">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-red-800">{result.url}</span>
            <span className="text-red-600">Error: {result.error}</span>
          </div>
        </div>
      </div>
    );
  }

  const { url, mobile, desktop, link } = result;

  // Безпечне отримання даних
  const mobileData = mobile || {};
  const desktopData = desktop || {};

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const renderScoreCard = (title, score, colorClass) => (
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold">{Math.round(score || 0)}</div>
      <div className="text-xs">{getScoreLabel(score || 0)}</div>
    </div>
  );

  const renderMetrics = (data) => (
    <div className="space-y-4">
      {/* Core Web Vitals */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-3">Core Web Vitals</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">First Contentful Paint</div>
            <div className="font-semibold">{data.firstContentfulPaint || 'N/A'}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Largest Contentful Paint</div>
            <div className="font-semibold">{data.largestContentfulPaint || 'N/A'}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
            <div className="font-semibold">{data.cumulativeLayoutShift || 'N/A'}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">First Input Delay</div>
            <div className="font-semibold">{data.firstInputDelay || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Additional Metrics</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Speed Index</div>
            <div className="font-semibold">{data.speedIndex || 'N/A'}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Total Blocking Time</div>
            <div className="font-semibold">{data.totalBlockingTime || 'N/A'}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Time to Interactive</div>
            <div className="font-semibold">{data.timeToInteractive || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      {data.opportunities && data.opportunities.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-3">Optimization Opportunities</h4>
          <div className="space-y-2">
            {data.opportunities.slice(0, 5).map((opportunity, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="font-medium text-sm">{opportunity.title || 'Unknown'}</div>
                <div className="text-xs text-gray-600 mt-1">{opportunity.description || ''}</div>
                {opportunity.displayValue && (
                  <div className="text-xs text-blue-600 mt-1">Potential savings: {opportunity.displayValue}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostics */}
      {data.diagnostics && data.diagnostics.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-3">Issues to Fix</h4>
          <div className="space-y-2">
            {data.diagnostics.slice(0, 5).map((diagnostic, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="font-medium text-sm">{diagnostic.title || 'Unknown'}</div>
                <div className="text-xs text-gray-600 mt-1">{diagnostic.description || ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-md mb-2">
      <div
        className="flex justify-between items-center space-x-4 p-4 cursor-pointer bg-gray-100 hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-full flex items-center justify-between space-x-4">
          <span className="font-bold text-lg">{url}</span>
          <div className="flex ml-auto space-x-2">
            <span className={`px-2 py-1 rounded text-xs ${getScoreColor(mobileData.performanceScore)}`}>
              Mobile: {Math.round(mobileData.performanceScore || 0)}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${getScoreColor(desktopData.performanceScore)}`}>
              Desktop: {Math.round(desktopData.performanceScore || 0)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            View Report
          </a>
          <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-white">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            <button
              onClick={() => setActiveTab('mobile')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'mobile'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => setActiveTab('desktop')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'desktop'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Desktop
            </button>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {renderScoreCard('Performance', activeTab === 'mobile' ? mobileData.performanceScore : desktopData.performanceScore, getScoreColor(activeTab === 'mobile' ? mobileData.performanceScore : desktopData.performanceScore))}
            {renderScoreCard('Accessibility', activeTab === 'mobile' ? mobileData.accessibilityScore : desktopData.accessibilityScore, getScoreColor(activeTab === 'mobile' ? mobileData.accessibilityScore : desktopData.accessibilityScore))}
            {renderScoreCard('Best Practices', activeTab === 'mobile' ? mobileData.bestPracticesScore : desktopData.bestPracticesScore, getScoreColor(activeTab === 'mobile' ? mobileData.bestPracticesScore : desktopData.bestPracticesScore))}
            {renderScoreCard('SEO', activeTab === 'mobile' ? mobileData.seoScore : desktopData.seoScore, getScoreColor(activeTab === 'mobile' ? mobileData.seoScore : desktopData.seoScore))}
          </div>

          {/* Detailed Metrics */}
          {renderMetrics(activeTab === 'mobile' ? mobileData : desktopData)}
        </div>
      )}
    </div>
  );
};

export default PageSpeedResult;
