import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import TasksPage from './pages/TasksPage';
import StatsPage from './pages/StatsPage';
import FocusMode from './components/FocusMode';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import { TabProvider, useTabs } from './contexts/TabContext';
import { ToastContainer } from './utils/toast';
import { useTheme } from './contexts/ThemeContext';
import ThemeFontApplier from './components/ThemeFontApplier';

/**
 * Main App content component that uses the contexts
 */
const AppContent: React.FC = () => {
  const { activeTab } = useTabs();
  const { theme } = useTheme();
  const [isFocusModeOpen, setFocusModeOpen] = useState(false);
  
  // Apply theme class directly to body
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme, 'theme-transition');
    
    return () => {
      document.body.classList.remove(theme, 'theme-transition');
    };
  }, [theme]);
  
  const openFocusMode = () => {
    setFocusModeOpen(true);
  };
  
  const closeFocusMode = () => {
    setFocusModeOpen(false);
  };

  return (
    <>
      <ThemeFontApplier />
      <div className={`min-h-screen pb-10 transition-colors duration-300 ${theme}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Header />
          <main className="mt-6 sm:mt-8">
            <TabNavigation />
            {activeTab === 'tasks' && <TasksPage />}
            {activeTab === 'stats' && <StatsPage />}
          </main>
          
          {/* Floating Focus Mode Button */}
          <button
            onClick={openFocusMode}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 transform hover:scale-105"
            aria-label="Enter focus mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="ml-2 font-medium">Focus Mode</span>
          </button>
          
          {/* Focus Mode Component */}
          <FocusMode isOpen={isFocusModeOpen} onClose={closeFocusMode} />
          
          {/* Toast notifications */}
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

/**
 * Main App component orchestrating the To-Do List application
 * Provides context providers for theme, tasks and tabs
 */
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <TabProvider>
          <AppContent />
        </TabProvider>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App; 