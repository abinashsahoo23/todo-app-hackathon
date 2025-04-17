import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { useTheme } from '../contexts/ThemeContext';

/**
 * TaskForm component provides interface for adding new tasks
 * Features error handling for empty submissions and visual feedback
 */
const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const { themeColors } = useTheme();
  
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'Work' | 'Study' | 'Personal'>('Personal');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter a task description');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    
    setIsSubmitting(true);
    
    // Clear any existing error
    setError('');
    
    // Add the task with a slight delay to show the animation
    setTimeout(() => {
      addTask(text.trim(), category);
      setText('');
      setIsSubmitting(false);
      if (inputRef.current) inputRef.current.focus();
    }, 200);
  };

  // Get appropriate button style based on category
  const getCategoryButtonClass = (cat: string) => {
    const isSelected = category === cat;
    let baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ";
    
    if (cat === 'Work') {
      return baseClasses + (isSelected 
        ? "bg-red-500 text-white shadow-md transform scale-105" 
        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:bg-opacity-30");
    } else if (cat === 'Study') {
      return baseClasses + (isSelected 
        ? "bg-blue-500 text-white shadow-md transform scale-105" 
        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:bg-opacity-30");
    } else {
      return baseClasses + (isSelected 
        ? "bg-green-500 text-white shadow-md transform scale-105" 
        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900 dark:hover:bg-opacity-30");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
      <div className="mb-4">
        <label htmlFor="task" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id="task"
            className={`task-input ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
          />
          {error && (
            <div className="error-message" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {['Work', 'Study', 'Personal'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={getCategoryButtonClass(cat)}
              onClick={() => setCategory(cat as 'Work' | 'Study' | 'Personal')}
              style={{
                backgroundColor: category === cat && cat === 'Work' ? themeColors.primary : 
                                 category === cat && cat === 'Study' ? themeColors.accent :
                                 category === cat && cat === 'Personal' ? themeColors.secondary : ''
              }}
            >
              {cat === 'Work' && (
                <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                </svg>
              )}
              {cat === 'Study' && (
                <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              )}
              {cat === 'Personal' && (
                <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <button
        type="submit"
        className={`btn btn-primary w-full sm:w-auto flex items-center justify-center ${isSubmitting ? 'opacity-75' : ''}`}
        disabled={isSubmitting}
        style={{ backgroundColor: themeColors.primary }}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Task
          </>
        )}
      </button>
    </form>
  );
};

export default TaskForm; 