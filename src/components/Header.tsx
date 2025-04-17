import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Header component with app title and tagline
 */
const Header: React.FC = () => {
  const { themeColors } = useTheme();
  
  return (
    <header className="pt-6 pb-4 relative">
      {/* ThemeSwitcher positioned absolutely via its CSS */}
      <ThemeSwitcher />
      
      <div className="flex items-center justify-center mb-2 mt-2">
        <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ color: themeColors.primary }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">
          Task Master
        </h1>
      </div>
      <p className="text-center mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        Stay organized, boost productivity, and never miss a deadline
      </p>
      <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ backgroundColor: themeColors.primary }}></div>
    </header>
  );
};

export default Header; 