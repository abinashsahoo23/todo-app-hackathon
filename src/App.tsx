import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ThemeToggle from './components/ThemeToggle';

export interface Task {
  id: string;
  text: string;
  category: 'Work' | 'Study' | 'Personal';
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Complete React project', category: 'Work', completed: false },
    { id: '2', text: 'Study TypeScript', category: 'Study', completed: false },
    { id: '3', text: 'Go for a run', category: 'Personal', completed: false },
  ]);
  
  const [darkMode, setDarkMode] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTask = (text: string, category: 'Work' | 'Study' | 'Personal') => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      category,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTasks(items);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen pb-10 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex justify-end pt-4">
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        </div>
        <Header />
        <main className="mt-8">
          <TaskForm addTask={addTask} />
          <DragDropContext onDragEnd={handleDragEnd}>
            <TaskList 
              tasks={tasks} 
              toggleTaskCompletion={toggleTaskCompletion} 
              deleteTask={deleteTask} 
            />
          </DragDropContext>
        </main>
      </div>
    </div>
  );
};

export default App; 