import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Task } from '../../types';
import PomodoroTimer from './PomodoroTimer';
import AmbientSounds from './AmbientSounds';
import './styles.css';

// Motivation quotes for break screens
const MOTIVATION_QUOTES = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "The most difficult thing is the decision to act, the rest is merely tenacity.", author: "Amelia Earhart" },
  { quote: "Quality is not an act, it is a habit.", author: "Aristotle" },
];

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  const { themeColors } = useTheme();
  const { tasks, startTaskTimer, stopTaskTimer, categories } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState(MOTIVATION_QUOTES[0]);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string>('rain');
  const focusModeRef = useRef<HTMLDivElement>(null);
  
  // Filter for incomplete tasks
  const incompleteTasks = tasks.filter(task => !task.completed);

  // Use useCallback for handleClose to maintain referential equality
  const handleClose = useCallback(() => {
    // Make sure to stop the timer when closing focus mode
    if (selectedTask && timerRunning) {
      stopTaskTimer(selectedTask.id);
    }
    setTimerRunning(false);
    onClose();
  }, [selectedTask, timerRunning, stopTaskTimer, onClose]);
  
  // Handle escape key to exit focus mode
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleClose]);
  
  // Select a random motivational quote for break time
  useEffect(() => {
    if (isBreakTime) {
      const randomIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
      setMotivationalQuote(MOTIVATION_QUOTES[randomIndex]);
    }
  }, [isBreakTime]);
  
  // Manage body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when open
    }
    
    return () => {
      document.body.style.overflow = 'auto'; // Always re-enable scrolling on unmount or when closed
    };
  }, [isOpen]);
  
  // Animate entrance and exit
  useEffect(() => {
    const element = focusModeRef.current;
    if (!element) return;
    
    if (isOpen) {
      element.classList.add('focus-mode-enter');
      element.classList.remove('focus-mode-exit');
    } else {
      element.classList.remove('focus-mode-enter');
      element.classList.add('focus-mode-exit');
    }
  }, [isOpen]);

  const handleTaskSelection = (task: Task) => {
    if (selectedTask && selectedTask.id === task.id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };
  
  const handleStartTimer = () => {
    if (selectedTask) {
      startTaskTimer(selectedTask.id);
      setTimerRunning(true);
    }
  };
  
  const handleStopTimer = () => {
    if (selectedTask) {
      stopTaskTimer(selectedTask.id);
      setTimerRunning(false);
    }
  };
  
  const handleBreakStart = () => {
    setIsBreakTime(true);
    if (selectedTask) {
      stopTaskTimer(selectedTask.id);
    }
  };
  
  const handleBreakEnd = () => {
    setIsBreakTime(false);
    if (selectedTask && timerRunning) {
      startTaskTimer(selectedTask.id);
    }
  };
  
  const toggleSound = () => {
    setIsSoundPlaying(!isSoundPlaying);
  };
  
  const changeSound = (sound: string) => {
    setCurrentSound(sound);
    if (!isSoundPlaying) {
      setIsSoundPlaying(true);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      ref={focusModeRef}
      className="focus-mode-overlay" 
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="focus-mode-container">
        <div className="focus-mode-header">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: themeColors.primary }}>
            {isBreakTime ? 'Break Time' : 'Focus Mode'}
          </h2>
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Close focus mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="focus-mode-content">
          {isBreakTime ? (
            <div className="break-content">
              <div className="quote-container">
                <p className="quote">"{motivationalQuote.quote}"</p>
                <p className="author">— {motivationalQuote.author}</p>
              </div>
              
              <div className="break-image">
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Relaxing scene" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              
              <p className="break-tip">
                Take this time to stretch, walk around, drink water, or rest your eyes.
              </p>
            </div>
          ) : (
            <>
              <div className="task-selection">
                <h3 className="text-lg font-semibold mb-3">Select a task to focus on:</h3>
                
                <div className="task-list">
                  {incompleteTasks.length > 0 ? (
                    incompleteTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => handleTaskSelection(task)}
                        className={`task-item ${selectedTask?.id === task.id ? 'selected' : ''}`}
                        style={{ 
                          borderColor: selectedTask?.id === task.id ? themeColors.primary : 'transparent',
                          backgroundColor: selectedTask?.id === task.id ? `${themeColors.primary}10` : 'transparent'
                        }}
                      >
                        <span className="task-text">{task.text}</span>
                        <span className="task-category" style={{ backgroundColor: themeColors.secondary }}>
                          {categories.find(c => c.id === task.categoryId)?.name || 'Uncategorized'}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No incomplete tasks available. Add some tasks first!
                    </p>
                  )}
                </div>
              </div>
              
              {selectedTask && (
                <div className="mt-6 text-center">
                  <p className="mb-2 text-lg font-medium">
                    Currently focusing on:
                  </p>
                  <p className="text-xl font-bold mb-4" style={{ color: themeColors.primary }}>
                    {selectedTask.text}
                  </p>
                </div>
              )}
            </>
          )}
          
          <div className="pomodoro-container">
            <PomodoroTimer 
              isRunning={timerRunning}
              isBreak={isBreakTime}
              onTimerStart={handleStartTimer}
              onTimerStop={handleStopTimer}
              onBreakStart={handleBreakStart}
              onBreakEnd={handleBreakEnd}
              disabled={!selectedTask && !isBreakTime}
            />
          </div>
          
          <div className="ambient-sounds-container">
            <AmbientSounds 
              isPlaying={isSoundPlaying} 
              currentSound={currentSound}
              onTogglePlay={toggleSound} 
              onChangeSound={changeSound} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode; 