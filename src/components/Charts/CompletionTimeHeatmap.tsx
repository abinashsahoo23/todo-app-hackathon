import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Task } from '../../types';

interface HeatmapData {
  timeOfDay: string;
  count: number;
  percentage: number;
}

interface CompletionTimeHeatmapProps {
  tasks: Task[];
}

const CompletionTimeHeatmap: React.FC<CompletionTimeHeatmapProps> = ({ tasks }) => {
  const { themeColors } = useTheme();
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  
  useEffect(() => {
    // Process completion times 
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    
    // Initialize time period counters
    const timePeriods: Record<string, number> = {
      'Early Morning (5am-8am)': 0,
      'Morning (8am-12pm)': 0,
      'Afternoon (12pm-5pm)': 0,
      'Evening (5pm-9pm)': 0,
      'Night (9pm-5am)': 0
    };
    
    // Count tasks by completion time
    completedTasks.forEach(task => {
      if (task.completedAt) {
        const completionHour = new Date(task.completedAt).getHours();
        
        if (completionHour >= 5 && completionHour < 8) {
          timePeriods['Early Morning (5am-8am)']++;
        } else if (completionHour >= 8 && completionHour < 12) {
          timePeriods['Morning (8am-12pm)']++;
        } else if (completionHour >= 12 && completionHour < 17) {
          timePeriods['Afternoon (12pm-5pm)']++;
        } else if (completionHour >= 17 && completionHour < 21) {
          timePeriods['Evening (5pm-9pm)']++;
        } else {
          timePeriods['Night (9pm-5am)']++;
        }
      }
    });
    
    // Calculate total for percentages
    const total = Object.values(timePeriods).reduce((sum, count) => sum + count, 0);
    
    // Create data array for heatmap
    const data = Object.entries(timePeriods).map(([timeOfDay, count]) => ({
      timeOfDay,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
    
    setHeatmapData(data);
  }, [tasks]);
  
  // Get intensity class based on percentage
  const getIntensityClass = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (percentage < 10) return 'bg-blue-50 dark:bg-blue-900/20';
    if (percentage < 20) return 'bg-blue-100 dark:bg-blue-900/30';
    if (percentage < 30) return 'bg-blue-200 dark:bg-blue-800/40';
    if (percentage < 50) return 'bg-blue-300 dark:bg-blue-700/50';
    if (percentage < 70) return 'bg-blue-400 dark:bg-blue-600/60';
    return 'bg-blue-500 dark:bg-blue-500/70';
  };
  
  // Get color class for text based on intensity
  const getTextColorClass = (percentage: number) => {
    if (percentage >= 50) return 'text-white';
    return 'text-gray-800 dark:text-gray-200';
  };
  
  // Get icon for time of day
  const getTimeIcon = (timeOfDay: string) => {
    if (timeOfDay.includes('Early Morning')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    if (timeOfDay.includes('Morning')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    if (timeOfDay.includes('Afternoon')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    if (timeOfDay.includes('Evening')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
        Productivity Patterns
      </h3>
      
      <div className="space-y-2">
        {heatmapData.map((data, index) => (
          <div key={index} className="flex items-center">
            <div className="w-40 text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span className="mr-2">{getTimeIcon(data.timeOfDay)}</span>
              <span>{data.timeOfDay.split(' ')[0]}</span>
            </div>
            
            <div className="flex-1 relative h-10">
              <div 
                className={`absolute inset-0 rounded-md transition-all duration-1000 ${getIntensityClass(data.percentage)}`}
                style={{ width: `${Math.max(data.percentage, 5)}%` }}
              >
                <div className={`absolute inset-0 flex items-center px-3 ${getTextColorClass(data.percentage)}`}>
                  <span className="font-medium">{data.count}</span>
                  <span className="text-xs ml-1">({data.percentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-2">Less productive</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800/40 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-300 dark:bg-blue-700/50 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-400 dark:bg-blue-600/60 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-500/70 rounded-sm"></div>
          </div>
          <span className="ml-2">More productive</span>
        </div>
      </div>
    </div>
  );
};

export default CompletionTimeHeatmap; 