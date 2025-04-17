import React from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';

// Success toast with checkmark icon
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: 3000,
    style: {
      background: '#22c55e',
      color: '#fff',
    },
    ...options,
  });
};

// Error toast with X icon
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: 4000,
    style: {
      background: '#ef4444',
      color: '#fff',
    },
    ...options,
  });
};

// Info toast with i icon
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    duration: 3000,
    icon: '🔔',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
    ...options,
  });
};

// Custom toast for task completion
export const showTaskCompletedToast = (taskName: string, options?: ToastOptions) => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Task completed
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {taskName}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200 dark:border-gray-700">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Dismiss
          </button>
        </div>
      </div>
    ),
    {
      duration: 4000,
      ...options,
    }
  );
};

// Toast container
export const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
  );
};

// Create a named exports object
const toastUtils = {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
  taskCompleted: showTaskCompletedToast,
  ToastContainer,
};

export default toastUtils; 