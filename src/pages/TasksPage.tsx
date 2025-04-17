import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { TaskPriority } from '../types';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import CategoryTabs from '../components/tasks/CategoryTabs';
import CategoryManager from '../components/tasks/CategoryManager';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import { motion, AnimatePresence } from 'framer-motion';

const TasksPage: React.FC = () => {
  const { categories } = useTasks();
  const pageRef = useRef<HTMLDivElement>(null);
  
  // State for filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | undefined>(undefined);
  const [showCompleted, setShowCompleted] = useState(true);
  
  // State for category manager
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  useEffect(() => {
    const element = pageRef.current;
    if (element) {
      element.classList.add('tab-enter');
    }
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId: string | undefined) => {
    setSelectedCategoryId(categoryId);
  };

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle priority filter change
  const handlePriorityChange = (priority: TaskPriority | undefined) => {
    setSelectedPriority(priority);
  };

  // Handle completed tasks filter toggle
  const handleCompletedToggle = () => {
    setShowCompleted(prev => !prev);
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSelectedCategoryId(undefined);
    setSearchQuery('');
    setSelectedPriority(undefined);
    setShowCompleted(true);
  };

  // Determine if any filters are active
  const hasActiveFilters = !!selectedCategoryId || !!searchQuery || !!selectedPriority || !showCompleted;

  return (
    <motion.div 
      ref={pageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <TaskForm />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center">
          <CategoryTabs 
            categories={categories} 
            selectedCategoryId={selectedCategoryId} 
            onChange={handleCategorySelect} 
          />
          
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="ml-2 p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Manage categories"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar 
            value={searchQuery} 
            onChange={handleSearch}
            placeholder="Search tasks..."
          />

          <FilterDropdown 
            priorities={['High', 'Medium', 'Low']}
            selectedPriority={selectedPriority}
            onPriorityChange={handlePriorityChange}
            showCompleted={showCompleted}
            onCompletedToggle={handleCompletedToggle}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mb-4 text-sm flex flex-wrap items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">Active filters:</span>
          
          {selectedCategoryId && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-400 px-2 py-1 rounded-full">
              Category: {categories.find(c => c.id === selectedCategoryId)?.name}
              <button 
                className="ml-1 text-blue-600 dark:text-blue-300 focus:outline-none" 
                onClick={() => setSelectedCategoryId(undefined)}
                aria-label="Remove category filter"
              >
                ×
              </button>
            </span>
          )}
          
          {selectedPriority && (
            <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:bg-opacity-30 dark:text-purple-400 px-2 py-1 rounded-full">
              Priority: {selectedPriority}
              <button 
                className="ml-1 text-purple-600 dark:text-purple-300 focus:outline-none" 
                onClick={() => setSelectedPriority(undefined)}
                aria-label="Remove priority filter"
              >
                ×
              </button>
            </span>
          )}
          
          {!showCompleted && (
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400 px-2 py-1 rounded-full">
              Only active tasks
              <button 
                className="ml-1 text-green-600 dark:text-green-300 focus:outline-none" 
                onClick={() => setShowCompleted(true)}
                aria-label="Remove completed tasks filter"
              >
                ×
              </button>
            </span>
          )}
          
          {searchQuery && (
            <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:bg-opacity-30 dark:text-orange-400 px-2 py-1 rounded-full">
              Search: "{searchQuery}"
              <button 
                className="ml-1 text-orange-600 dark:text-orange-300 focus:outline-none" 
                onClick={() => setSearchQuery('')}
                aria-label="Remove search filter"
              >
                ×
              </button>
            </span>
          )}
          
          <button 
            className="text-gray-600 dark:text-gray-400 underline hover:text-gray-800 dark:hover:text-gray-200 text-xs ml-auto"
            onClick={handleClearFilters}
          >
            Clear all filters
          </button>
        </div>
      )}

      <TaskList 
        filter={{
          categoryId: selectedCategoryId,
          searchQuery: searchQuery,
          priority: selectedPriority,
          showCompleted: showCompleted
        }} 
      />

      <AnimatePresence>
        {isCategoryManagerOpen && (
          <CategoryManager 
            isOpen={isCategoryManagerOpen} 
            onClose={() => setIsCategoryManagerOpen(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TasksPage; 