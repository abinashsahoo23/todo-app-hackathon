import React from 'react';

interface ThemeToggleProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

/**
 * ThemeToggle component for switching between light and dark modes
 * Features animated transitions and hover effects
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
        focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md
        hover:shadow-lg transition-all duration-300 transform hover:scale-105
        flex items-center justify-center"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun icon with animation */}
        <div className={`absolute inset-0 transition-transform duration-500 ${darkMode ? 'translate-y-0' : 'translate-y-full'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        
        {/* Moon icon with animation */}
        <div className={`absolute inset-0 transition-transform duration-500 ${darkMode ? 'translate-y-full' : 'translate-y-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle; 