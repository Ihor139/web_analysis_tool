import React from 'react';

const StatisticsCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <div className="text-2xl font-bold">
            {value}
          </div>
          <div className="text-sm font-medium">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs opacity-75 mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatisticsGrid = ({ stats, title = "Statistics" }) => {
  if (!stats) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => {
          // Визначаємо іконку та колір на основі ключа
          let icon, color = 'blue';
          
          if (key.includes('total') || key.includes('count')) {
            icon = (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            );
            color = 'blue';
          } else if (key.includes('error') || key.includes('failed')) {
            icon = (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            );
            color = 'red';
          } else if (key.includes('success') || key.includes('passed')) {
            icon = (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            );
            color = 'green';
          } else if (key.includes('warning') || key.includes('avg')) {
            icon = (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            );
            color = 'yellow';
          } else {
            icon = (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            );
            color = 'purple';
          }

          return (
            <StatisticsCard
              key={key}
              title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              value={value}
              icon={icon}
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StatisticsGrid;
