import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { useTheme } from '../../contexts/ThemeContext';
import { TaskPriority } from '../../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

/**
 * TaskForm component provides interface for adding new tasks
 * with category, priority and due date options
 */
const TaskForm: React.FC = () => {
  const { addTask, categories } = useTasks();
  const { themeColors } = useTheme();
  
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    
    setIsSubmitting(true);
    
    // Clear any existing error
    setError('');
    
    // Format due date if provided
    let formattedDueDate: string | undefined;
    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      dueDateObj.setHours(23, 59, 59, 999); // Set to end of day
      formattedDueDate = dueDateObj.toISOString();
    }
    
    // Add the task with a slight delay to show the animation
    setTimeout(() => {
      addTask(text.trim(), categoryId, priority, formattedDueDate);
      setText('');
      setIsExpanded(false);
      setIsSubmitting(false);
      if (inputRef.current) inputRef.current.focus();
    }, 200);
  };

  // Get appropriate button style based on selected category
  const getCategoryButtonClass = (catId: string) => {
    const isSelected = categoryId === catId;
    const category = categories.find(c => c.id === catId);
    const colorStyle = category ? `${category.color}25` : '#e5e7eb';
    
    let baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ";
    
    return baseClasses + (isSelected 
      ? `bg-[${category?.color}] text-white shadow-md transform scale-105` 
      : `bg-[${colorStyle}] text-gray-800 dark:text-gray-200 hover:bg-[${category?.color}15]`);
  };

  // Get appropriate button style based on priority
  const getPriorityButtonClass = (p: TaskPriority) => {
    const isSelected = priority === p;
    let baseClasses = "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ";
    
    switch (p) {
      case 'High':
        return baseClasses + (isSelected 
          ? "bg-red-500 text-white shadow-sm" 
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400");
      case 'Medium':
        return baseClasses + (isSelected 
          ? "bg-yellow-500 text-white shadow-sm" 
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-400");
      case 'Low':
        return baseClasses + (isSelected 
          ? "bg-green-500 text-white shadow-sm" 
          : "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400");
      default:
        return baseClasses;
    }
  };

  return (
    <motion.div 
      layout
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form 
        onSubmit={handleSubmit} 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg"
      >
        <div className="mb-4">
          <label htmlFor="task" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              id="task"
              className={`task-input w-full px-4 py-2 border border-gray-300 dark:border-gray-700 
                rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white
                ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Add a new task..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError('');
                if (!isExpanded && e.target.value.length > 2) {
                  setIsExpanded(true);
                }
              }}
              onFocus={() => text.length > 0 && setIsExpanded(true)}
            />
            {error && (
              <div className="error-message text-red-500 text-xs mt-1 flex items-center" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
        
        {/* Expandable section with additional options */}
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center ${
                      categoryId === category.id 
                        ? 'text-white shadow-sm' 
                        : 'bg-opacity-20 text-gray-800 dark:text-gray-200'
                    }`}
                    style={{
                      backgroundColor: categoryId === category.id 
                        ? category.color 
                        : `${category.color}25`
                    }}
                    onClick={() => setCategoryId(category.id)}
                  >
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: categoryId === category.id ? 'white' : category.color }}></span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {(['High', 'Medium', 'Low'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={getPriorityButtonClass(p)}
                    onClick={() => setPriority(p)}
                  >
                    {p === 'High' && (
                      <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {p === 'Medium' && (
                      <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {p === 'Low' && (
                      <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {p}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-5">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white w-full sm:w-auto"
                value={dueDate}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-between items-center">
          {!isExpanded && (
            <button 
              type="button" 
              onClick={() => setIsExpanded(true)}
              className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add details
              </span>
            </button>
          )}
          
          <button
            type="submit"
            className={`btn btn-primary w-full sm:w-auto flex items-center justify-center
              px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors ${isExpanded ? 'sm:ml-auto' : 'ml-auto'} ${isSubmitting ? 'opacity-75' : ''}`}
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
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;