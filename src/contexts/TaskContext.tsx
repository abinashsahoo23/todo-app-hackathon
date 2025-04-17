import React, { createContext, useContext, useState, useEffect, useCallback, useReducer } from 'react';
import { Task, TaskStats, TaskCategory, TaskPriority } from '../types';
import { isToday, isThisWeek, format, parseISO } from 'date-fns';

// Define action types for the reducer
type TaskAction = 
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'timeSpent' | 'isTimerRunning' | 'timerStartedAt'> }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'REORDER_TASKS'; payload: { sourceIndex: number; destinationIndex: number } }
  | { type: 'START_TIMER'; payload: { id: string } }
  | { type: 'STOP_TIMER'; payload: { id: string } }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'ADD_CATEGORY'; payload: TaskCategory }
  | { type: 'DELETE_CATEGORY'; payload: { id: string } }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<TaskCategory> } };

interface TaskState {
  tasks: Task[];
  categories: TaskCategory[];
}

interface TaskContextType {
  tasks: Task[];
  categories: TaskCategory[];
  addTask: (text: string, categoryId: string, priority?: TaskPriority, dueDate?: string) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (sourceIndex: number, destinationIndex: number) => void;
  startTaskTimer: (id: string) => void;
  stopTaskTimer: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<TaskCategory>) => void;
  taskStats: TaskStats;
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  searchTasks: (query: string) => Task[];
}

// Reducer function to handle all task-related state changes
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      const newTask: Task = {
        id: Date.now().toString(),
        text: action.payload.text,
        categoryId: action.payload.categoryId,
        priority: action.payload.priority || 'Medium',
        dueDate: action.payload.dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        timeSpent: 0,
        isTimerRunning: false,
        timerStartedAt: null
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask]
      };
      
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            // If completing a task, stop its timer
            let updatedTask = task;
            if (!task.completed && task.isTimerRunning) {
              const timerStartedAt = task.timerStartedAt 
                ? new Date(task.timerStartedAt).getTime() 
                : Date.now();
                
              const additionalSeconds = Math.floor((Date.now() - timerStartedAt) / 1000);
              
              updatedTask = { 
                ...task, 
                isTimerRunning: false,
                timerStartedAt: null,
                timeSpent: task.timeSpent + additionalSeconds
              };
            }
            
            return { 
              ...updatedTask, 
              completed: !task.completed,
              // If marking as complete, set completedAt timestamp
              completedAt: !task.completed ? new Date().toISOString() : null
            };
          }
          return task;
        })
      };
      
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id)
      };
      
    case 'REORDER_TASKS':
      const result = Array.from(state.tasks);
      const [removed] = result.splice(action.payload.sourceIndex, 1);
      result.splice(action.payload.destinationIndex, 0, removed);
      return {
        ...state,
        tasks: result
      };
      
    case 'START_TIMER':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return { 
              ...task, 
              isTimerRunning: true,
              timerStartedAt: new Date().toISOString()
            };
          }
          return task;
        })
      };
      
    case 'STOP_TIMER':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id && task.isTimerRunning) {
            const timerStartedAt = task.timerStartedAt 
              ? new Date(task.timerStartedAt).getTime() 
              : Date.now();
              
            const additionalSeconds = Math.floor((Date.now() - timerStartedAt) / 1000);
            
            return { 
              ...task, 
              isTimerRunning: false,
              timerStartedAt: null,
              timeSpent: task.timeSpent + additionalSeconds
            };
          }
          return task;
        })
      };
      
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => 
          task.id === action.payload.id 
            ? { ...task, ...action.payload.updates } 
            : task
        )
      };
      
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
      
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload.id),
        // Optional: Also remove or reassign tasks with this category
        tasks: state.tasks.map(task => 
          task.categoryId === action.payload.id 
            ? { ...task, categoryId: state.categories[0]?.id || 'uncategorized' }
            : task
        )
      };
      
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id
            ? { ...category, ...action.payload.updates }
            : category
        )
      };
      
    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with stored data or defaults
  const initialState = (): TaskState => {
    const savedState = localStorage.getItem('taskState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        tasks: parsedState.tasks.map((task: Task) => ({
          ...task,
          isTimerRunning: false,
          timeSpent: task.timeSpent || 0,
          priority: task.priority || 'Medium',
          createdAt: task.createdAt || new Date().toISOString(),
          completedAt: task.completedAt || null,
        })),
        categories: parsedState.categories || defaultCategories
      };
    }
    
    return {
      tasks: [
        { 
          id: '1', 
          text: 'Complete React project', 
          categoryId: 'work', 
          priority: 'High',
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          timeSpent: 0,
          isTimerRunning: false,
          timerStartedAt: null
        },
        { 
          id: '2', 
          text: 'Study TypeScript', 
          categoryId: 'study', 
          priority: 'Medium',
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          timeSpent: 0,
          isTimerRunning: false,
          timerStartedAt: null
        },
        { 
          id: '3', 
          text: 'Go for a run', 
          categoryId: 'personal', 
          priority: 'Low',
          dueDate: new Date().toISOString(),
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          timeSpent: 0,
          isTimerRunning: false,
          timerStartedAt: null
        },
      ],
      categories: defaultCategories
    };
  };

  // Default categories
  const defaultCategories: TaskCategory[] = [
    { id: 'work', name: 'Work', color: '#ef4444' },
    { id: 'study', name: 'Study', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', color: '#22c55e' }
  ];

  // Setup reducer
  const [state, dispatch] = useReducer(taskReducer, initialState());
  const { tasks, categories } = state;

  // Update running timers 
  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach(task => {
        if (task.isTimerRunning) {
          dispatch({ 
            type: 'UPDATE_TASK', 
            payload: { 
              id: task.id, 
              updates: { timeSpent: task.timeSpent + 1 } 
            } 
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  // Calculate task statistics
  const calculateStats = useCallback((): TaskStats => {
    const completedTasks = tasks.filter(task => task.completed);
    const completedToday = completedTasks.filter(task => 
      task.completedAt && isToday(parseISO(task.completedAt))
    ).length;
    
    const completedThisWeek = completedTasks.filter(task => 
      task.completedAt && isThisWeek(parseISO(task.completedAt))
    ).length;

    // Calculate average completion time
    const completionTimes = completedTasks
      .filter(task => task.completedAt && task.timeSpent)
      .map(task => task.timeSpent);
    
    const averageCompletionTime = completionTimes.length 
      ? completionTimes.reduce((acc, time) => acc + time, 0) / completionTimes.length 
      : 0;
    
    // Calculate category distribution
    const categoryDistribution: Record<string, number> = {};
    for (const task of tasks) {
      const category = categories.find(c => c.id === task.categoryId)?.name || 'Uncategorized';
      if (!categoryDistribution[category]) {
        categoryDistribution[category] = 0;
      }
      categoryDistribution[category]++;
    }
    
    // Calculate most productive time of day
    const completionHours = completedTasks
      .filter(task => task.completedAt)
      .map(task => new Date(task.completedAt!).getHours());
      
    const hourCounts: Record<number, number> = {};
    let maxCount = 0;
    let mostProductiveHour = 0;
    
    for (const hour of completionHours) {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      if (hourCounts[hour] > maxCount) {
        maxCount = hourCounts[hour];
        mostProductiveHour = hour;
      }
    }
    
    const mostProductiveTime = maxCount ? format(new Date().setHours(mostProductiveHour), 'ha') : 'N/A';
    
    // Daily completions for chart
    const dailyMap: Record<string, number> = {};
    for (const task of completedTasks) {
      if (task.completedAt) {
        const dateStr = format(parseISO(task.completedAt), 'yyyy-MM-dd');
        dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
      }
    }
    
    const dailyCompletions = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7); // Last 7 days
      
    // Priority distribution
    const priorityDistribution = {
      High: tasks.filter(task => task.priority === 'High').length,
      Medium: tasks.filter(task => task.priority === 'Medium').length,
      Low: tasks.filter(task => task.priority === 'Low').length,
    };
    
    // Due soon tasks
    const today = new Date();
    const dueSoonTasks = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate).getTime() - today.getTime() < 86400000 * 2 // 2 days
    ).length;
      
    return {
      completedToday,
      completedThisWeek,
      averageCompletionTime,
      mostProductiveTime,
      categoryDistribution,
      priorityDistribution,
      dueSoonTasks,
      dailyCompletions
    };
  }, [tasks, categories]);
  
  const [taskStats, setTaskStats] = useState<TaskStats>(calculateStats());
  
  // Update statistics whenever tasks change
  useEffect(() => {
    setTaskStats(calculateStats());
    localStorage.setItem('taskState', JSON.stringify({ tasks, categories }));
  }, [tasks, categories, calculateStats]);

  // Action creators
  const addTask = (text: string, categoryId: string, priority: TaskPriority = 'Medium', dueDate?: string) => {
    dispatch({
      type: 'ADD_TASK',
      payload: { 
        text, 
        categoryId, 
        priority, 
        dueDate: dueDate || null,
        completed: false
      }
    });
  };

  const toggleTaskCompletion = (id: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: { id } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  };

  const reorderTasks = (sourceIndex: number, destinationIndex: number) => {
    dispatch({ 
      type: 'REORDER_TASKS', 
      payload: { sourceIndex, destinationIndex } 
    });
  };

  const startTaskTimer = (id: string) => {
    dispatch({ type: 'START_TIMER', payload: { id } });
  };

  const stopTaskTimer = (id: string) => {
    dispatch({ type: 'STOP_TIMER', payload: { id } });
    return tasks.find(task => task.id === id);
  };
  
  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };
  
  const addCategory = (name: string, color: string) => {
    const newCategory: TaskCategory = {
      id: `category-${Date.now()}`,
      name,
      color
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };
  
  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: { id } });
  };
  
  const updateCategory = (id: string, updates: Partial<TaskCategory>) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates } });
  };
  
  // Filtering and searching functions
  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId);
  };
  
  const getTasksByPriority = (priority: TaskPriority) => {
    return tasks.filter(task => task.priority === priority);
  };
  
  const searchTasks = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.text.toLowerCase().includes(lowerQuery) ||
      categories.find(c => c.id === task.categoryId)?.name.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      categories,
      addTask,
      toggleTaskCompletion,
      deleteTask,
      reorderTasks,
      startTaskTimer,
      stopTaskTimer,
      updateTask,
      addCategory,
      deleteCategory,
      updateCategory,
      taskStats,
      getTasksByCategory,
      getTasksByPriority,
      searchTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}; 