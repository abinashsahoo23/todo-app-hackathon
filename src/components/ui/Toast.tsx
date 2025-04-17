import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toastVariants } from '../../utils/animations';
import { XIcon, CheckCircleIcon, ExclamationIcon, InformationCircleIcon } from '@heroicons/react/outline';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'error':
        return <ExclamationIcon className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <ExclamationIcon className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBackgroundClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400';
    }
  };

  return (
    <motion.div
      key={id}
      className={`rounded-md shadow-md p-4 max-w-md w-full flex items-start gap-3 ${getBackgroundClass()} theme-transition`}
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0 pt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 ml-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {message}
        </p>
      </div>
      
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-1 p-1 rounded hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Close notification"
      >
        <XIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
    </motion.div>
  );
};

export default Toast; 