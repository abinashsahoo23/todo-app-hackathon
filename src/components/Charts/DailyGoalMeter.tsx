import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface DailyGoalMeterProps {
  completedTasks: number;
  goalTasks: number;
}

const DailyGoalMeter: React.FC<DailyGoalMeterProps> = ({ completedTasks, goalTasks = 8 }) => {
  const { themeColors } = useTheme();
  const [progress, setProgress] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);
  
  // Calculate the percentage for the circular progress
  const percentage = Math.min(Math.round((completedTasks / goalTasks) * 100), 100);
  const circumference = 2 * Math.PI * 42; // r = 42
  const offset = circumference - (percentage / 100) * circumference;
  
  // Animate the progress on load and when count changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [percentage]);
  
  // Animate the counter
  useEffect(() => {
    if (animatedCount < completedTasks) {
      const timer = setTimeout(() => {
        setAnimatedCount(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
    if (animatedCount > completedTasks) {
      setAnimatedCount(completedTasks);
    }
  }, [animatedCount, completedTasks]);

  // Determine color based on progress percentage
  const getColorClass = () => {
    if (percentage >= 100) return 'text-emerald-500';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 30) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
        Daily Goal Progress
      </h3>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#e5e7eb" 
            strokeWidth="8" 
            fill="none" 
            className="dark:opacity-10"
          />
          
          {/* Animated progress circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke={themeColors.primary} 
            strokeWidth="8" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ 
              transition: "stroke-dashoffset 1s ease-in-out",
              filter: percentage >= 100 ? `drop-shadow(0 0 6px ${themeColors.primary})` : 'none'
            }}
          />
        </svg>
        
        {/* Count and percentage display */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span className={`text-4xl font-bold ${getColorClass()}`}>
              {animatedCount}
            </span>
            <span className="text-xl text-gray-500 dark:text-gray-400">/{goalTasks}</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {percentage}% complete
          </span>
        </div>
      </div>
      
      {/* Status message */}
      <div className="mt-4 text-center">
        {percentage >= 100 ? (
          <div className="text-emerald-500 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Daily goal achieved!
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-400">
            {goalTasks - completedTasks} more tasks to reach your goal
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyGoalMeter; 