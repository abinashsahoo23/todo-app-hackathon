import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface PomodoroTimerProps {
  isRunning: boolean;
  isBreak: boolean;
  disabled: boolean;
  onTimerStart: () => void;
  onTimerStop: () => void;
  onBreakStart: () => void;
  onBreakEnd: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isRunning,
  isBreak,
  disabled,
  onTimerStart,
  onTimerStop,
  onBreakStart,
  onBreakEnd
}) => {
  const { themeColors } = useTheme();
  const [minutes, setMinutes] = useState(isBreak ? 5 : 25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(isRunning);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set appropriate time based on focus/break state
  useEffect(() => {
    if (isBreak) {
      setMinutes(5);
      setSeconds(0);
    } else {
      setMinutes(25);
      setSeconds(0);
    }
  }, [isBreak]);
  
  // Update internal active state when external running state changes
  useEffect(() => {
    setIsActive(isRunning);
  }, [isRunning]);

  // Timer logic
  useEffect(() => {
    if (!isActive) return;
    
    timerRef.current = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 0) {
          if (minutes === 0) {
            // Timer complete
            setIsActive(false);
            clearInterval(timerRef.current!);
            
            // Switch between focus and break
            if (isBreak) {
              onBreakEnd();
            } else {
              onBreakStart();
            }
            
            return 0;
          }
          
          // Decrement minutes, reset seconds
          setMinutes(prevMinutes => prevMinutes - 1);
          return 59;
        }
        
        // Just decrement seconds
        return prevSeconds - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, minutes, isBreak, onBreakStart, onBreakEnd]);

  const handleToggleTimer = () => {
    if (!isActive) {
      if (disabled) return;
      
      // Reset if timer is complete
      if (minutes === 0 && seconds === 0) {
        if (isBreak) {
          setMinutes(5);
        } else {
          setMinutes(25);
        }
      }
      
      setIsActive(true);
      onTimerStart();
    } else {
      setIsActive(false);
      onTimerStop();
    }
  };

  const handleResetTimer = () => {
    setIsActive(false);
    onTimerStop();
    
    if (isBreak) {
      setMinutes(5);
    } else {
      setMinutes(25);
    }
    setSeconds(0);
  };

  // Format time display
  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage for circular timer
  const calculateProgress = () => {
    const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
    const remainingSeconds = minutes * 60 + seconds;
    const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
    return progress;
  };
  
  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 42; // r = 42
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="pomodoro-timer">
      <div className="timer-display-container">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Progress circle */}
          <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="42" 
              stroke="#e5e7eb" 
              strokeWidth="4" 
              fill="none" 
              className="dark:opacity-10"
            />
            
            <circle 
              cx="50" 
              cy="50" 
              r="42" 
              stroke={isBreak ? '#10B981' : themeColors.primary} 
              strokeWidth="4" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          
          {/* Time display */}
          <div className="absolute flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {formatTime(minutes, seconds)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isBreak ? 'Break' : 'Focus'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="timer-controls flex justify-center mt-4">
        <button
          onClick={handleToggleTimer}
          disabled={disabled && !isActive}
          className={`px-4 py-2 rounded-lg mr-2 flex items-center ${
            disabled && !isActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
          }`}
          style={{ 
            backgroundColor: isActive ? '#EF4444' : (isBreak ? '#10B981' : themeColors.primary),
            color: 'white'
          }}
        >
          {isActive ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Start
            </>
          )}
        </button>
        
        <button
          onClick={handleResetTimer}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
      </div>
      
      <div className="timer-info text-sm text-center mt-4 text-gray-500 dark:text-gray-400">
        {isBreak ? (
          <p>Take a 5-minute break to recharge</p>
        ) : (
          <p>Focus for 25 minutes on your task</p>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer; 