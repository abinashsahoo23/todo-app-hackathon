import React from 'react';

interface TaskActionsProps {
  taskId: string;
  onDelete: () => void;
  isCompleted: boolean;
  stopPropagation: (e: React.MouseEvent) => void;
}

/**
 * TaskActions component provides action buttons for a task
 */
const TaskActions: React.FC<TaskActionsProps> = ({ 
  taskId, 
  onDelete, 
  isCompleted, 
  stopPropagation 
}) => {
  return (
    <div className="flex items-center space-x-1 ml-2" onClick={stopPropagation}>
      <button
        onClick={onDelete}
        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200
          p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-30"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <div 
        className="cursor-grab p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Drag to reorder"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
    </div>
  );
};

export default TaskActions; 