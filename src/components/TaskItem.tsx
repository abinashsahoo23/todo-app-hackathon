import React, { useState } from 'react';
import { Task } from '../types';
import { formatDistanceToNow, formatDistance } from 'date-fns';
import { useTasks } from '../contexts/TaskContext';

interface TaskItemProps {
  task: Task;
  isDragging?: boolean;
}

/**
 * TaskItem component displays a single task with category badge, checkbox for completion, and delete button
 * Includes hover animations and visual feedback for interactions
 */
const TaskItem: React.FC<TaskItemProps> = ({ task, isDragging = false }) => {
  const { toggleTaskCompletion, deleteTask, startTaskTimer, stopTaskTimer, categories } = useTasks();
  const [isRemoving, setIsRemoving] = useState(false);

  // Get the category object for this task
  const category = categories.find(c => c.id === task.categoryId);

  // Get appropriate color classes based on task category
  const getCategoryClass = () => {
    const categoryName = category?.name || '';
    switch (categoryName) {
      case 'Work':
        return 'category-work';
      case 'Study':
        return 'category-study';
      case 'Personal':
        return 'category-personal';
      default:
        return '';
    }
  };

  // Handle task deletion with animation
  const handleDelete = () => {
    setIsRemoving(true);
    // Wait for animation to complete before removing
    setTimeout(() => deleteTask(task.id), 300);
  };

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
  const handleTimerToggle = () => {
    if (task.isTimerRunning) {
      stopTaskTimer(task.id);
    } else {
      startTaskTimer(task.id);
    }
  };

  // Calculate time ago string
  const timeAgo = task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : '';
  
  // Calculate completion time if completed
  const completionTime = task.completedAt ? formatDistance(
    new Date(task.completedAt),
    new Date(task.createdAt),
    { includeSeconds: true }
  ) : '';

  return (
    <div 
      className={`
        task-card 
        ${task.completed ? 'opacity-60' : ''} 
        ${isDragging ? 'dragging' : ''}
        ${isRemoving ? 'removing' : ''}
      `}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 cursor-pointer
              hover:scale-110 transition-transform"
          />
          <div className="flex-1">
            <p className={`text-gray-900 dark:text-white font-medium ${task.completed ? 'line-through text-opacity-60 dark:text-opacity-60' : ''} transition-all duration-200`}>
              {task.text}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pl-8 mt-1">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1.5 ${getCategoryClass()}`}>
              {category?.name === 'Work' && (
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                </svg>
              )}
              {category?.name === 'Study' && (
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              )}
              {category?.name === 'Personal' && (
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
              {category?.name || 'Uncategorized'}
            </span>
            
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="mr-2">🕒 {timeAgo}</span>
              
              {task.completed && completionTime && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed in {completionTime}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-3 flex items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">
                {formatTimeSpent(task.timeSpent)}
              </span>
              <button
                onClick={handleTimerToggle}
                className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                  ${task.isTimerRunning ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
                  ${task.completed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={task.completed}
                aria-label={task.isTimerRunning ? "Stop timer" : "Start timer"}
              >
                {task.isTimerRunning ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200
            p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-30"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="ml-2 cursor-grab p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 