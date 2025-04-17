import React, { useState, useRef, useEffect } from 'react';
import { TaskPriority } from '../../types';

interface FilterDropdownProps {
  priorities: TaskPriority[];
  selectedPriority?: TaskPriority;
  onPriorityChange: (priority: TaskPriority | undefined) => void;
  showCompleted: boolean;
  onCompletedToggle: () => void;
  onClearFilters: () => void;
}

/**
 * FilterDropdown component provides a dropdown menu for task filtering options
 */
const FilterDropdown: React.FC<FilterDropdownProps> = ({
  priorities,
  selectedPriority,
  onPriorityChange,
  showCompleted,
  onCompletedToggle,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle selecting a priority
  const handlePriorityChange = (priority: TaskPriority) => {
    onPriorityChange(selectedPriority === priority ? undefined : priority);
  };
  
  // Check if any filters are active
  const hasActiveFilters = !!selectedPriority || !showCompleted;
  
  // Get the color for the priority badge
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center px-4 py-2 border ${
          hasActiveFilters 
            ? 'border-blue-500 text-blue-700 dark:text-blue-400' 
            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
        } rounded-md bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg 
          className="mr-2 h-5 w-5 text-gray-400" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" 
            clipRule="evenodd" 
          />
        </svg>
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="ml-2 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full">
            {selectedPriority && !showCompleted ? '2' : '1'}
          </span>
        )}
        <svg 
          className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 divide-y divide-gray-100 dark:divide-gray-700"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Priority Filter */}
          <div className="py-3 px-4">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Priority
            </h3>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium ${
                    selectedPriority === priority 
                      ? `${getPriorityColor(priority)} ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800` 
                      : `${getPriorityColor(priority)} opacity-70`
                  }`}
                  onClick={() => handlePriorityChange(priority)}
                  aria-pressed={selectedPriority === priority}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
          
          {/* Show/Hide Completed Tasks */}
          <div className="py-3 px-4">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Completion Status
            </h3>
            <div className="flex items-center">
              <button
                type="button"
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
                  showCompleted ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={showCompleted}
                onClick={onCompletedToggle}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-gray-200 shadow transform ring-0 transition ease-in-out duration-200 ${
                    showCompleted ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Show completed tasks
              </span>
            </div>
          </div>
          
          {/* Footer/Actions */}
          <div className="py-2 px-4">
            <button
              type="button"
              className="w-full text-left text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1"
              onClick={() => {
                onClearFilters();
                setIsOpen(false);
              }}
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;