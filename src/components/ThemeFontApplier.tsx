import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Component that forces theme fonts by injecting a style tag directly into the document head
 */
const ThemeFontApplier: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Remove any existing style tag we previously added
    const existingStyle = document.getElementById('theme-font-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create a new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-font-styles';
    
    // Define font styles based on current theme
    let fontStyles = '';
    
    if (theme === 'neo-tokyo') {
      fontStyles = `
        body { font-family: 'Saira Stencil One', sans-serif !important; }
        * { font-family: 'Saira Stencil One', sans-serif !important; }
        h1, h2, h3, h4, h5, h6 { 
          font-family: 'Saira Stencil One', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
        }
      `;
    } else if (theme === 'pastel-vibes') {
      fontStyles = `
        body { font-family: 'Comic Neue', cursive !important; }
        * { font-family: 'Comic Neue', cursive !important; }
        h1, h2, h3, h4, h5, h6 { 
          font-family: 'Comic Neue', cursive !important;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
      `;
    } else if (theme === 'dark-academia') {
      fontStyles = `
        body { font-family: 'Cormorant Garamond', serif !important; }
        * { font-family: 'Cormorant Garamond', serif !important; }
        h1, h2, h3, h4, h5, h6 { 
          font-family: 'Cormorant Garamond', serif !important;
          font-style: italic;
          letter-spacing: 0.7px;
          font-weight: 500;
        }
      `;
    }

    styleElement.textContent = fontStyles;
    
    // Add the style tag to the document head
    document.head.appendChild(styleElement);
    
    // Cleanup on unmount
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [theme]);

  return null; // This component doesn't render anything
};

export default ThemeFontApplier; 