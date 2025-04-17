import React from 'react';
import { useTasks } from '../../contexts/TaskContext';

interface TaskTimerProps {
  timeSpent: number;
  isRunning: boolean;
  isCompleted: boolean;
  taskId: string;
}

/**
 * TaskTimer component displays and controls the timer for a task
 */
const TaskTimer: React.FC<TaskTimerProps> = ({ 
  timeSpent, 
  isRunning, 
  isCompleted, 
  taskId 
}) => {
  const { startTaskTimer, stopTaskTimer } = useTasks();

  // Format time spent in a readable format (mm:ss or hh:mm:ss)
  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Handle timer toggle
  const handleTimerToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRunning) {
      stopTaskTimer(taskId);
    } else {
      startTaskTimer(taskId);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Time spent:</span> {formatTimeSpent(timeSpent)}
      </div>
      
      <button
        onClick={handleTimerToggle}
        className={`
          p-2 rounded-md transition-colors flex items-center
          ${isRunning ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400' : 
                        'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-400'}
          ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80 cursor-pointer'}
        `}
        disabled={isCompleted}
        aria-label={isRunning ? "Stop timer" : "Start timer"}
      >
        {isRunning ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Stop</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Start</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TaskTimer; 