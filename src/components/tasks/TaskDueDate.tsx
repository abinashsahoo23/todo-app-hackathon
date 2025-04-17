import React, { useState, useRef, useEffect } from 'react';
import { format, isBefore, isToday, addDays } from 'date-fns';

interface TaskDueDateProps {
  dueDate: string;
  isCompleted: boolean;
  onUpdate: (newDate: string) => void;
}

/**
 * TaskDueDate component displays task due date with visual indicators
 * and allows changing the date
 */
const TaskDueDate: React.FC<TaskDueDateProps> = ({ 
  dueDate, 
  isCompleted, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Format the date for display
  const formattedDate = format(new Date(dueDate), 'MMM d, yyyy');
  
  // Determine status
  const isOverdue = !isCompleted && isBefore(new Date(dueDate), new Date());
  const isDueToday = isToday(new Date(dueDate));
  const isDueSoon = !isCompleted && !isOverdue && !isDueToday && 
                    isBefore(new Date(dueDate), addDays(new Date(), 2));

  // Handle click to edit
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    // Format date for input field (YYYY-MM-DD)
    setDateValue(format(new Date(dueDate), 'yyyy-MM-dd'));
  };

  // Handle saving the date
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dateValue) {
      // Set time to end of day for the selected date
      const selectedDate = new Date(dateValue);
      selectedDate.setHours(23, 59, 59, 999);
      onUpdate(selectedDate.toISOString());
    }
    
    setIsEditing(false);
  };

  // Handle clicking outside to cancel
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const getStatusStyle = () => {
    if (isCompleted) return 'text-gray-400';
    if (isOverdue) return 'text-red-600 dark:text-red-400 font-medium';
    if (isDueToday) return 'text-orange-600 dark:text-orange-400 font-medium';
    if (isDueSoon) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="relative inline-flex items-center">
      {!isEditing ? (
        <button
          onClick={handleEditClick}
          className={`flex items-center ${getStatusStyle()} hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-sm`}
          aria-label="Edit due date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isOverdue && 'Overdue: '}
          {isDueToday && 'Due today: '}
          {isDueSoon && !isDueToday && 'Due soon: '}
          {formattedDate}
        </button>
      ) : (
        <form onSubmit={handleSave} className="flex items-center bg-white dark:bg-gray-700 rounded shadow-sm p-1">
          <input
            ref={inputRef}
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="text-xs border-0 focus:ring-0 bg-transparent dark:text-white"
            aria-label="Change due date"
          />
          <div className="flex space-x-1 ml-1">
            <button
              type="submit"
              className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 dark:hover:bg-opacity-30 rounded"
              aria-label="Save new due date"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:bg-opacity-30 rounded"
              aria-label="Cancel changing due date"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskDueDate; 