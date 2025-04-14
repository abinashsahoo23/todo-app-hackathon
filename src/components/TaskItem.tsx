import React from 'react';
import { Task } from '../App';

interface TaskItemProps {
  task: Task;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleTaskCompletion, deleteTask }) => {
  const getCategoryClass = () => {
    switch (task.category) {
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

  return (
    <div className={`task-card ${task.completed ? 'opacity-70' : ''}`}>
      <div className="flex-1 flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTaskCompletion(task.id)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
        />
        <div className="flex-1">
          <p className={`text-gray-900 dark:text-white font-medium ${task.completed ? 'line-through' : ''}`}>
            {task.text}
          </p>
          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getCategoryClass()}`}>
            {task.category}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => deleteTask(task.id)}
          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="ml-2 cursor-grab">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 