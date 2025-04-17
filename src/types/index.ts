export interface Task {
  id: string;
  text: string;
  categoryId: string;
  priority: TaskPriority;
  dueDate: string | null; // ISO string for due date
  completed: boolean;
  createdAt: string; // ISO string
  completedAt: string | null; // ISO string
  timeSpent: number; // in seconds
  isTimerRunning?: boolean;
  timerStartedAt?: string | null; // ISO string
}

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
}

export type Theme = 
  | 'neo-tokyo'
  | 'pastel-vibes' 
  | 'dark-academia';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  accent: string;
}

export interface TaskStats {
  completedToday: number;
  completedThisWeek: number;
  averageCompletionTime: number;
  mostProductiveTime: string;
  categoryDistribution: Record<string, number>;
  priorityDistribution?: Record<TaskPriority, number>;
  dueSoonTasks?: number;
  dailyCompletions: {
    date: string;
    count: number;
  }[];
} 