import React, { useState } from 'react';
import { TaskCategory } from '../../types';
import { useTasks } from '../../contexts/TaskContext';
import { motion } from 'framer-motion';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CategoryManager component allows users to create, edit, and delete categories
 */
const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose }) => {
  const { categories, addCategory, deleteCategory, updateCategory } = useTasks();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [editingCategory, setEditingCategory] = useState<TaskCategory | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  
  // Pre-defined color options
  const colorOptions = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#f43f5e', // rose
  ];
  
  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    
    addCategory(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName('');
    setNewCategoryColor('#3b82f6');
  };
  
  // Handle updating a category
  const handleUpdateCategory = () => {
    if (!editingCategory || editingCategory.name.trim() === '') return;
    
    updateCategory(editingCategory.id, {
      name: editingCategory.name,
      color: editingCategory.color
    });
    
    setEditingCategory(null);
  };
  
  // Handle initiating the delete confirmation
  const initiateDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      alert('You must have at least one category');
      return;
    }
    
    setConfirmingDelete(id);
  };
  
  // Handle confirming the category deletion
  const confirmDeleteCategory = () => {
    if (confirmingDelete) {
      deleteCategory(confirmingDelete);
      if (editingCategory?.id === confirmingDelete) {
        setEditingCategory(null);
      }
      setConfirmingDelete(null);
    }
  };
  
  // Handle canceling the category deletion
  const cancelDeleteCategory = () => {
    setConfirmingDelete(null);
  };
  
  // Start editing a category
  const startEditing = (category: TaskCategory) => {
    setEditingCategory({ ...category });
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingCategory(null);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {confirmingDelete && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this category? Tasks in this category will be moved to the default category.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelDeleteCategory}
                  className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCategory}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Manage Categories
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Add new category form */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              Add New Category
            </h3>
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full ${newCategoryColor === color ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategoryColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={newCategoryName.trim() === ''}
                className={`px-4 py-2 rounded-md text-white ${
                  newCategoryName.trim() === '' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Add Category
              </button>
            </div>
          </div>
          
          {/* Existing categories list */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              Existing Categories
            </h3>
            <div className="space-y-3">
              {categories.map(category => (
                <div 
                  key={category.id}
                  className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm"
                >
                  {editingCategory?.id === category.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {colorOptions.map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`w-6 h-6 rounded-full ${editingCategory.color === color ? 'ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-gray-800' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setEditingCategory({ ...editingCategory, color })}
                            aria-label={`Select color ${color}`}
                          />
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleUpdateCategory}
                          disabled={editingCategory.name.trim() === ''}
                          className={`px-3 py-1.5 rounded-md text-white text-sm ${
                            editingCategory.name.trim() === '' 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => startEditing(category)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          aria-label={`Edit category ${category.name}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => initiateDeleteCategory(category.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          aria-label={`Delete category ${category.name}`}
                          disabled={categories.length <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryManager; 