import React from 'react';
import { TaskCategory as TaskCategoryType } from '../../types';

interface TaskCategoryProps {
  category: TaskCategoryType;
}

/**
 * TaskCategory component displays a category badge with appropriate styles
 */
const TaskCategory: React.FC<TaskCategoryProps> = ({ category }) => {
  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${category.color}25`, // 25% opacity
        color: category.color,
        borderColor: `${category.color}50` // 50% opacity
      }}
    >
      {category.name}
    </span>
  );
};

export default TaskCategory; 