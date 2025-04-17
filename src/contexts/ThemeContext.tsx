import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Theme, ThemeColors } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeContextType {
  theme: Theme;
  themeColors: ThemeColors;
  setTheme: (theme: Theme) => void;
  nextTheme: () => void;
  isDarkMode: boolean;
}

const themeColorMap: Record<Theme, ThemeColors> = {
  'neo-tokyo': {
    primary: '#00f0ff',
    secondary: '#ff00aa',
    background: '#090916',
    backgroundSecondary: '#0f0f24',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    accent: '#ffcc00'
  },
  'pastel-vibes': {
    primary: '#b5a9ff',
    secondary: '#ffafcc',
    background: '#fffcf7',
    backgroundSecondary: '#f8edeb',
    text: '#6d6875',
    textSecondary: '#8d8393',
    accent: '#fec89a'
  },
  'dark-academia': {
    primary: '#9c6644',
    secondary: '#7d5a50',
    background: '#f5ebe0',
    backgroundSecondary: '#e3d5ca',
    text: '#3d2b24',
    textSecondary: '#57453c',
    accent: '#b08968'
  }
};

// Define array of dark themes for special text handling
const darkThemes = ['neo-tokyo'];

// Theme order for cycling through with nextTheme
const themeOrder: Theme[] = [
  'neo-tokyo',
  'pastel-vibes',
  'dark-academia'
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && Object.keys(themeColorMap).includes(savedTheme)) {
      return savedTheme as Theme;
    }
    
    // Set default theme to pastel-vibes
    return 'pastel-vibes';
  });
  
  const [previousTheme, setPreviousTheme] = useState<Theme>(theme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth theme transition
  const setTheme = useCallback((newTheme: Theme) => {
    if (newTheme === theme) return;
    
    setIsTransitioning(true);
    setPreviousTheme(theme);
    
    // Add brief delay for animation
    setTimeout(() => {
      setThemeState(newTheme);
      setIsTransitioning(false);
    }, 300);
  }, [theme]);
  
  // Get next theme in cycle
  const nextTheme = useCallback(() => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }, [theme, setTheme]);
  
  // Determine if current theme is dark mode
  const isDarkMode = darkThemes.includes(theme);

  useEffect(() => {
    // Apply theme class to the HTML element (root)
    const htmlElement = document.documentElement;
    
    // Remove all theme classes first
    htmlElement.classList.remove(...Object.keys(themeColorMap));
    htmlElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    // Handle dark mode class for Tailwind
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Apply transition class for smooth theme transitions
    if (isTransitioning) {
      htmlElement.classList.add('theme-transition');
    } else {
      setTimeout(() => {
        htmlElement.classList.remove('theme-transition');
      }, 300);
    }
    
    // Handle dark theme text
    if (darkThemes.includes(theme)) {
      htmlElement.classList.add('dark-theme-text');
    } else {
      htmlElement.classList.remove('dark-theme-text');
    }

    // Add CSS variables for theme colors
    const colors = themeColorMap[theme];
    Object.entries(colors).forEach(([key, value]) => {
      htmlElement.style.setProperty(`--color-${key}`, value);
      
      // Also add RGB values for opacity utilities
      if (key === 'primary' || key === 'secondary' || key === 'accent') {
        const hex = value.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        htmlElement.style.setProperty(`--${key}-rgb`, `${r}, ${g}, ${b}`);
      }
    });
  }, [theme, isDarkMode, isTransitioning]);

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        themeColors: themeColorMap[theme], 
        setTheme, 
        nextTheme,
        isDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 