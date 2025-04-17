import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

interface ThemeOption {
  name: Theme;
  label: string;
  icon: React.ReactNode;
  description?: string;
  emoji?: string;
}

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, nextTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [firstVisit, setFirstVisit] = useState(() => {
    return !localStorage.getItem('theme_switcher_visited');
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.theme-switcher-container')) {
        setIsOpen(false);
        setShowPreview(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Mark as visited after first time opening
      if (firstVisit) {
        localStorage.setItem('theme_switcher_visited', 'true');
        setFirstVisit(false);
      }
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, firstVisit]);

  const themes: ThemeOption[] = [
    {
      name: 'neo-tokyo',
      label: 'Neo Tokyo',
      description: 'Futuristic, cyberpunk vibes',
      emoji: '🌆',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'pastel-vibes',
      label: 'Pastel Vibes',
      description: 'Soft, cute aesthetic',
      emoji: '🌸',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      name: 'dark-academia',
      label: 'Dark Academia',
      description: 'Vintage, intellectual aesthetics',
      emoji: '📚',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    }
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

  const getThemePreviewClass = (themeName: Theme) => {
    switch (themeName) {
      case 'neo-tokyo':
        return 'theme-preview-neo-tokyo';
      case 'pastel-vibes':
        return 'theme-preview-pastel-vibes';
      case 'dark-academia':
        return 'theme-preview-dark-academia';
      default:
        return 'theme-preview-pastel-vibes';
    }
  };

  // Check if a theme is dark for styling
  const isDarkTheme = (themeName: Theme): boolean => {
    return ['neo-tokyo'].includes(themeName);
  };

  const handleThemeHover = (themeName: Theme) => {
    setPreviewTheme(themeName);
  };

  const handleThemeLeave = () => {
    setPreviewTheme(null);
    setShowPreview(false);
  };

  const handleThemeClick = (themeName: Theme) => {
    setTheme(themeName);
    setIsOpen(false);
    setShowPreview(false);
  };

  return (
    <div className="theme-switcher-container">
      <div className="floating-theme-switcher">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`theme-toggle-button theme-button ${firstVisit ? 'attention-pulse' : ''}`}
          aria-label="Theme options"
          title="Change theme"
        >
          <div className={`w-5 h-5 rounded-full ${getThemeCircleStyle(theme)}`} />
          {firstVisit && 
            <div className="theme-tooltip">
              Change Theme
              <div className="tooltip-arrow"></div>
            </div>
          }
        </button>

        {isOpen && (
          <div className={`theme-options-container ${theme}`}>
            <div className="theme-header">
              <h3>Choose Theme</h3>
              <div className="current-theme-indicator">
                Current: <span>{themes.find(t => t.name === theme)?.label}</span>
              </div>
            </div>
            
            {themes.map((t) => (
              <button
                key={t.name}
                onMouseEnter={() => handleThemeHover(t.name)}
                onMouseLeave={handleThemeLeave}
                onClick={() => handleThemeClick(t.name)}
                className={`theme-option-button ${theme === t.name ? 'theme-active' : ''} ${t.name}`}
                title={t.description}
              >
                <div className="theme-icon-container">
                  <div className={`theme-circle ${getThemeCircleStyle(t.name)}`} />
                  <span className="theme-label">
                    {t.label}
                  </span>
                </div>
                {previewTheme === t.name && (
                  <div className={`theme-preview ${getThemePreviewClass(t.name)}`}>
                    <div className="preview-content">
                      <div className="preview-icon">{t.icon}</div>
                      <div className="preview-name">{t.label}</div>
                      {t.description && <div className="preview-desc">{t.description}</div>}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Simplified full page theme preview - disabled by default */}
      {showPreview && previewTheme && (
        <div 
          className={`fullpage-preview ${getThemePreviewClass(previewTheme)}`}
          onClick={() => setShowPreview(false)}
        >
          <div className="preview-overlay">
            <div className="preview-content-large">
              <h3 className="text-lg font-medium mb-2">{themes.find(t => t.name === previewTheme)?.label} Theme</h3>
              <p className="text-sm mb-3">Click to apply this theme</p>
              <button 
                className="preview-apply-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleThemeClick(previewTheme);
                }}
              >
                Apply Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 