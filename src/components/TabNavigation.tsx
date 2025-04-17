import React from 'react';
import { useTabs, TabName } from '../contexts/TabContext';
import { useTheme } from '../contexts/ThemeContext';

const TabNavigation: React.FC = () => {
  const { theme } = useTheme();
  const { activeTab, setActiveTab } = useTabs();
  const { themeColors } = useTheme();

  const tabs: { id: TabName; label: string; icon: React.ReactNode }[] = [
    {
      id: 'tasks',
      label: 'Tasks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  // Check if the current theme is dark
  const isDarkTheme = ['neo-tokyo'].includes(theme);

  return (
    <div className="flex space-x-4 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            tab-button flex items-center space-x-2 px-5 py-3 rounded-lg transition-all duration-300
            ${activeTab === tab.id ? 'active' : ''}
            ${isDarkTheme 
              ? 'dark-tab-button' 
              : 'light-tab-button'
            }
          `}
          style={{
            backgroundColor: activeTab === tab.id 
              ? themeColors.primary 
              : isDarkTheme 
                ? 'rgba(30, 30, 30, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
            color: activeTab === tab.id 
              ? '#ffffff' 
              : isDarkTheme 
                ? 'rgba(255, 255, 255, 0.9)' 
                : themeColors.text,
            boxShadow: activeTab === tab.id 
              ? `0 4px 14px ${themeColors.primary}40` 
              : '0 2px 6px rgba(0,0,0,0.05)',
            borderBottom: activeTab === tab.id 
              ? `2px solid ${themeColors.primary}` 
              : '2px solid transparent',
            fontFamily: 'var(--header-font, sans-serif)'
          }}
        >
          <span className={`transition-all duration-300 ${activeTab === tab.id ? 'scale-110 transform' : ''}`}>
            {tab.icon}
          </span>
          <span className={`font-medium transition-all duration-300 ${activeTab === tab.id ? 'tracking-wide' : ''}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 