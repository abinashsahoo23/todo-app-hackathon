import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="pt-6 pb-4">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
        My To-Do List
      </h1>
      <p className="text-center mt-2 text-gray-600 dark:text-gray-400">
        Organize your tasks efficiently
      </p>
    </header>
  );
};

export default Header; 