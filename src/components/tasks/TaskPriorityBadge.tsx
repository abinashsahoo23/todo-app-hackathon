import React, { useState } from 'react';
import { TaskPriority } from '../../types';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  onUpdate: (priority: TaskPriority) => void;
}

/**
 * TaskPriorityBadge displays a color-coded badge with priority level
 * and allows toggling between priorities
 */
const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ 
  priority, 
  onUpdate 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPriorityStyle = (prio: TaskPriority) => {
    switch (prio) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
    }
  };

  const handlePriorityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePriorityChange = (newPriority: TaskPriority, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(newPriority);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handlePriorityClick}
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${getPriorityStyle(priority)}`}
        aria-label={`Priority: ${priority}`}
      >
        <span className="flex items-center">
          {priority === 'High' && (
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {priority === 'Medium' && (
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {priority === 'Low' && (
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {priority}
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <div className="p-1">
            {(['High', 'Medium', 'Low'] as TaskPriority[]).map((p) => (
              <button
                key={p}
                onClick={(e) => handlePriorityChange(p, e)}
                className={`w-full text-left px-3 py-1 text-sm rounded-md mb-1 last:mb-0 flex items-center ${getPriorityStyle(p)}`}
              >
                {p === 'High' && (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {p === 'Medium' && (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {p === 'Low' && (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPriorityBadge; 