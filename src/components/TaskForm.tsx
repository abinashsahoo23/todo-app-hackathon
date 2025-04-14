import React, { useState } from 'react';

interface TaskFormProps {
  addTask: (text: string, category: 'Work' | 'Study' | 'Personal') => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'Work' | 'Study' | 'Personal'>('Personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTask(text.trim(), category);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="task" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task
        </label>
        <input
          type="text"
          id="task"
          className="task-input"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {['Work', 'Study', 'Personal'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                category === cat
                  ? `bg-${cat.toLowerCase() === 'work' ? 'purple' : cat.toLowerCase() === 'study' ? 'blue' : 'green'}-500 text-white`
                  : `bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-${
                      cat.toLowerCase() === 'work' ? 'purple' : cat.toLowerCase() === 'study' ? 'blue' : 'green'
                    }-100 dark:hover:bg-gray-600`
              }`}
              onClick={() => setCategory(cat as 'Work' | 'Study' | 'Personal')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <button
        type="submit"
        className="btn btn-primary w-full sm:w-auto"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm; 