import React from 'react';
import { TaskCategory } from '../../types';
import { motion } from 'framer-motion';

interface CategoryTabsProps {
  categories: TaskCategory[];
  selectedCategoryId?: string;
  onChange: (categoryId: string | undefined) => void;
}

/**
 * CategoryTabs component displays horizontal tabs for filtering tasks by category
 */
const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  selectedCategoryId, 
  onChange 
}) => {
  // Handle tab click
  const handleTabClick = (categoryId: string) => {
    // If the category is already selected, deselect it (show all tasks)
    if (selectedCategoryId === categoryId) {
      onChange(undefined);
    } else {
      onChange(categoryId);
    }
  };

  return (
    <div className="flex space-x-1 overflow-x-auto pb-1 hide-scrollbar">
      <button
        className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          !selectedCategoryId 
            ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 shadow-sm' 
            : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}
        onClick={() => onChange(undefined)}
        aria-pressed={!selectedCategoryId}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center`}
          style={{
            backgroundColor: selectedCategoryId === category.id 
              ? category.color 
              : `${category.color}25`, // 25% opacity
            color: selectedCategoryId === category.id 
              ? 'white' 
              : category.color
          }}
          onClick={() => handleTabClick(category.id)}
          aria-pressed={selectedCategoryId === category.id}
        >
          <span 
            className="w-2 h-2 rounded-full mr-2" 
            style={{ 
              backgroundColor: selectedCategoryId === category.id 
                ? 'white' 
                : category.color 
            }}
          />
          {category.name}
          
          {/* Show indicator if this tab is selected */}
          {selectedCategoryId === category.id && (
            <motion.div
              className="ml-2 bg-white bg-opacity-30 rounded-full px-1 text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              ✓
            </motion.div>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs; 