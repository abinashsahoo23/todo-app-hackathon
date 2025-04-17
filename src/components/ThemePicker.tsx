import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { name: Theme; label: string; icon: React.ReactNode }[] = [
    {
      name: 'neo-tokyo',
      label: 'Neo Tokyo',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'pastel-vibes',
      label: 'Pastel Vibes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      name: 'dark-academia',
      label: 'Dark Academia',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  const getThemeCircleStyle = (themeName: Theme) => {
    switch (themeName) {
      case 'neo-tokyo':
        return 'bg-gradient-to-br from-cyan-400 to-pink-500';
      case 'pastel-vibes':
        return 'bg-gradient-to-br from-purple-300 to-pink-200';
      case 'dark-academia':
        return 'bg-gradient-to-br from-amber-700 to-yellow-600';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
          focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md
          hover:shadow-lg transition-all duration-300 transform hover:scale-105
          flex items-center justify-center"
        aria-label="Theme options"
      >
        <div className={`w-5 h-5 rounded-full ${getThemeCircleStyle(theme)}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 animate-fade-in-down">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setTheme(t.name);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === t.name ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${getThemeCircleStyle(t.name)}`} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemePicker; 