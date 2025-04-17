import React, { useEffect, useRef, useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { useTheme } from '../contexts/ThemeContext';
import TaskCompletionChart from '../components/Charts/TaskCompletionChart';
import DailyGoalMeter from '../components/Charts/DailyGoalMeter';
import CompletionTimeHeatmap from '../components/Charts/CompletionTimeHeatmap';

const StatsPage: React.FC = () => {
  const { taskStats, tasks } = useTasks();
  const { themeColors } = useTheme();
  const pageRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    const element = pageRef.current;
    if (element) {
      element.classList.add('tab-enter');
    }
    
    // Check if milestone reached (no more confetti since we removed it)
    if (taskStats.completedToday >= 5 && !showConfetti) {
      setShowConfetti(true);
      // Removed confetti trigger
    }
  }, [taskStats.completedToday, showConfetti]);
  
  // Removed confetti animation function

  // Format seconds for display
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} min` : ''}`;
  };

  // Prepare category data for pie chart
  const categoryData = Object.entries(taskStats.categoryDistribution).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for pie chart segments
  const CATEGORY_COLORS = {
    Work: '#f87171',
    Study: '#60a5fa',
    Personal: '#4ade80'
  };

  return (
    <div ref={pageRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        Productivity Dashboard
      </h2>
      
      {/* Featured Summary Stats with Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Daily Goal Meter */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300">
          <DailyGoalMeter completedTasks={taskStats.completedToday} goalTasks={8} />
        </div>
        
        {/* Completion Time Heatmap */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300">
          <CompletionTimeHeatmap tasks={tasks} />
        </div>
      </div>
      
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Completed Today</h3>
          <p className="text-2xl font-bold" style={{ color: themeColors.primary }}>
            {taskStats.completedToday}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {taskStats.completedToday > 0 ? (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Keep up the good work!
              </span>
            ) : (
              <span>No tasks completed yet today</span>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Weekly Total</h3>
          <p className="text-2xl font-bold" style={{ color: themeColors.primary }}>
            {taskStats.completedThisWeek}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Tasks completed in the last 7 days
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Avg. Time Per Task</h3>
          <p className="text-2xl font-bold" style={{ color: themeColors.primary }}>
            {formatTime(Math.round(taskStats.averageCompletionTime))}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Average time spent on tasks
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Most Productive At</h3>
          <p className="text-2xl font-bold" style={{ color: themeColors.primary }}>
            {taskStats.mostProductiveTime}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Time of day with most completions
          </div>
        </div>
      </div>
      
      {/* Weekly Completions Chart - Enhanced */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-8">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
          Task Completions (Last 7 Days)
        </h3>
        <TaskCompletionChart data={taskStats.dailyCompletions} />
      </div>
      
      {/* Category Distribution Pie Chart */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Category Distribution</h3>
        <div className="h-56">
          <div className="flex flex-wrap justify-around">
            {categoryData.map((category, index) => (
              <div 
                key={`category-${index}`}
                className="flex flex-col items-center p-4 transition-transform transform hover:scale-105"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-3 text-white font-bold text-xl"
                  style={{ 
                    backgroundColor: CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS] || themeColors.primary,
                    boxShadow: `0 0 20px ${CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS]}50 || ${themeColors.primary}50`
                  }}
                >
                  {category.value}
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{category.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round((category.value / tasks.length) * 100)}% of tasks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 