import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import { useTasks } from '../../contexts/TaskContext';
import { Task, TaskPriority } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  filter?: {
    categoryId?: string;
    searchQuery?: string;
    priority?: TaskPriority;
    showCompleted?: boolean;
  };
}

/**
 * TaskList component displays tasks with drag and drop capabilities
 * and supports filtering by various criteria
 */
const TaskList: React.FC<TaskListProps> = ({ filter = {} }) => {
  const { 
    tasks, 
    categories, 
    reorderTasks, 
    getTasksByCategory,
    getTasksByPriority,
    searchTasks 
  } = useTasks();
  
  const [expanded, setExpanded] = useState<string[]>([]);

  // Toggle category expansion
  const toggleExpand = (categoryId: string) => {
    setExpanded(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  // Filter tasks based on provided criteria
  const getFilteredTasks = (): Task[] => {
    let filteredTasks = [...tasks];
    
    // Filter by category if specified
    if (filter.categoryId) {
      filteredTasks = getTasksByCategory(filter.categoryId);
    }
    
    // Filter by priority if specified
    if (filter.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
    }
    
    // Filter by search query if specified
    if (filter.searchQuery) {
      filteredTasks = searchTasks(filter.searchQuery);
    }
    
    // Filter completed tasks if specified
    if (filter.showCompleted === false) {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }
    
    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();
  
  // Group tasks by category for display
  const tasksByCategory: Record<string, Task[]> = {};
  
  // Initialize all categories with empty arrays
  categories.forEach(category => {
    tasksByCategory[category.id] = [];
  });
  
  // Populate categories with their tasks
  filteredTasks.forEach(task => {
    if (!tasksByCategory[task.categoryId]) {
      tasksByCategory[task.categoryId] = [];
    }
    tasksByCategory[task.categoryId].push(task);
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    reorderTasks(result.source.index, result.destination.index);
  };

  // Empty state for no tasks
  if (filteredTasks.length === 0) {
    return (
      <motion.div 
        className="empty-state mt-8 text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mt-4">No tasks found</h3>
        {filter.categoryId && (
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            No tasks in this category. Add one to get started!
          </p>
        )}
        {filter.searchQuery && (
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            No tasks match your search. Try a different query!
          </p>
        )}
        {!filter.categoryId && !filter.searchQuery && (
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            Add a task to get started with your day!
          </p>
        )}
      </motion.div>
    );
  }

  // If we're filtering by a specific category, just show those tasks
  if (filter.categoryId) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mt-6"
            >
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TaskItem 
                            task={task} 
                            isDragging={snapshot.isDragging} 
                          />
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  // Otherwise, group by category
  return (
    <div className="mt-6 space-y-8">
      {categories.map(category => {
        const categoryTasks = tasksByCategory[category.id] || [];
        if (categoryTasks.length === 0) return null;
        
        const isExpanded = expanded.includes(category.id);
        
        return (
          <div key={category.id} className="category-section">
            <div 
              className="category-header flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm cursor-pointer mb-3"
              onClick={() => toggleExpand(category.id)}
            >
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {categoryTasks.length} task{categoryTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button className="text-gray-500 dark:text-gray-400 focus:outline-none">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {isExpanded && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`category-${category.id}`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <AnimatePresence>
                        {categoryTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <TaskItem 
                                    task={task} 
                                    isDragging={snapshot.isDragging} 
                                  />
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskList; 