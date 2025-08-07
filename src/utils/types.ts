export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency: {
    days: number[];
  };
  reminder?: {
    time: string;
    enabled: boolean;
  };
  createdAt: string;
  completedDates: string[];
  streak: number;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}

export type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  getHabitCompletionStatus: (habitId: string, date: string) => boolean;
  getHabitStreak: (habitId: string) => number;
};