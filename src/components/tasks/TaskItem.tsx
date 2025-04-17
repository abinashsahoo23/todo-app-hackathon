import React, { useState } from 'react';
import { formatDistanceToNow, formatDistance, isBefore, addDays } from 'date-fns';
import { Task } from '../../types';
import { useTasks } from '../../contexts/TaskContext';

// Sub-components to improve modularity
import TaskCategory from './TaskCategory';
import TaskActions from './TaskActions';
import TaskTimer from './TaskTimer';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskDueDate from './TaskDueDate';

interface TaskItemProps {
  task: Task;
  isDragging?: boolean;
}

/**
 * TaskItem component displays a single task with all its details and actions
 */
const TaskItem: React.FC<TaskItemProps> = ({ task, isDragging = false }) => {
  const { toggleTaskCompletion, deleteTask, updateTask, categories } = useTasks();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Find the category for this task
  const category = categories.find(c => c.id === task.categoryId);

  // Handle task deletion with animation
  const handleDelete = () => {
    setIsRemoving(true);
    // Wait for animation to complete before removing
    setTimeout(() => deleteTask(task.id), 300);
  };

  // Toggle expanded view for mobile
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate time ago string
  const timeAgo = task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : '';
  
  // Calculate completion time if completed
  const completionTime = task.completedAt && task.createdAt ? formatDistance(
    new Date(task.completedAt),
    new Date(task.createdAt),
    { includeSeconds: true }
  ) : '';

  // Check if task is overdue
  const isOverdue = task.dueDate && 
                   !task.completed && 
                   isBefore(new Date(task.dueDate), new Date());

  // Check if task is due soon (within 48 hours)
  const isDueSoon = task.dueDate && 
                    !task.completed && 
                    !isOverdue &&
                    isBefore(new Date(task.dueDate), addDays(new Date(), 2));

  return (
    <div 
      className={`
        task-card relative rounded-lg shadow-sm border 
        transition-all duration-300 ease-in-out mb-3
        hover:shadow-md transform hover:-translate-y-1
        ${task.completed ? 'opacity-60 bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-800'}
        ${isDragging ? 'shadow-md scale-105 dragging z-50' : ''}
        ${isRemoving ? 'removing opacity-0 scale-95' : ''}
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
        ${isDueSoon ? 'border-l-4 border-l-yellow-500' : ''}
      `}
      data-testid="task-item"
      onClick={toggleExpand}
    >
      <div className="flex items-start p-4">
        <div className="mr-3 mt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              e.stopPropagation();
              toggleTaskCompletion(task.id);
            }}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer
              hover:scale-110 transition-transform"
            aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <div className="flex items-start justify-between mb-1">
              <h3 className={`text-base font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
                {task.text}
              </h3>
              
              <div className="flex items-center ml-2 space-x-1 md:space-x-2" onClick={e => e.stopPropagation()}>
                <TaskPriorityBadge priority={task.priority} onUpdate={(priority) => updateTask(task.id, { priority })} />
                {category && <TaskCategory category={category} />}
              </div>
            </div>

            <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeAgo}
              </span>
              
              {task.dueDate && (
                <TaskDueDate 
                  dueDate={task.dueDate} 
                  isCompleted={task.completed}
                  onUpdate={(newDate) => updateTask(task.id, { dueDate: newDate })} 
                />
              )}
              
              {isExpanded && task.completed && completionTime && (
                <span className="flex items-center mt-1 md:mt-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed in {completionTime}
                </span>
              )}
            </div>

            {isExpanded && (
              <div className="task-details mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <TaskTimer 
                  timeSpent={task.timeSpent} 
                  isRunning={task.isTimerRunning || false} 
                  isCompleted={task.completed}
                  taskId={task.id} 
                />
              </div>
            )}
          </div>
        </div>
        
        <TaskActions 
          taskId={task.id} 
          onDelete={handleDelete} 
          isCompleted={task.completed} 
          stopPropagation={(e) => e.stopPropagation()} 
        />
      </div>
    </div>
  );
};

export default TaskItem; 