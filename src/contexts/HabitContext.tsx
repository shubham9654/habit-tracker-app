import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitContextType } from '../utils/types';
import { loadHabits, saveHabits } from '../utils/storage';
import { getTodayFormatted, calculateStreak } from '../utils/dateUtils';
import { scheduleHabitReminder, cancelHabitReminder } from '../utils/notifications';

// Create the context with a default value
const HabitContext = createContext<HabitContextType>({
  habits: [],
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  toggleHabitCompletion: () => {},
  getHabitCompletionStatus: () => false,
  getHabitStreak: () => 0,
});

// Custom hook to use the habit context
export const   useHabits = () => useContext(HabitContext);

// Provider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from storage on initial render
  useEffect(() => {
    const fetchHabits = async () => {
      const storedHabits = await loadHabits();
      setHabits(storedHabits);
    };

    fetchHabits();
  }, []);

  // Save habits to storage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      saveHabits(habits);
    }
  }, [habits]);

  // Add a new habit
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      streak: 0,
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);

    // Schedule reminder if enabled
    if (newHabit.reminder && newHabit.reminder.enabled) {
      scheduleHabitReminder(newHabit);
    }
  };

  // Update an existing habit
  const updateHabit = (updatedHabit: Habit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );

    // Update reminder
    if (updatedHabit.reminder && updatedHabit.reminder.enabled) {
      scheduleHabitReminder(updatedHabit);
    } else {
      cancelHabitReminder(updatedHabit.id);
    }
  };

  // Delete a habit
  const deleteHabit = (id: string) => {
    // Cancel any reminders
    cancelHabitReminder(id);

    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  // Toggle habit completion for a specific date
  const toggleHabitCompletion = (habitId: string, date: string = getTodayFormatted()) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const isCompleted = habit.completedDates.includes(date);
        let updatedCompletedDates: string[];

        if (isCompleted) {
          // Remove the date if already completed
          updatedCompletedDates = habit.completedDates.filter((d) => d !== date);
        } else {
          // Add the date if not completed
          updatedCompletedDates = [...habit.completedDates, date];
        }

        // Calculate new streak
        const newStreak = calculateStreak(updatedCompletedDates);

        return {
          ...habit,
          completedDates: updatedCompletedDates,
          streak: newStreak,
        };
      })
    );
  };

  // Check if a habit is completed for a specific date
  const getHabitCompletionStatus = (habitId: string, date: string = getTodayFormatted()): boolean => {
    const habit = habits.find((h) => h.id === habitId);
    return habit ? habit.completedDates.includes(date) : false;
  };

  // Get the current streak for a habit
  const getHabitStreak = (habitId: string): number => {
    const habit = habits.find((h) => h.id === habitId);
    return habit ? habit.streak : 0;
  };

  const contextValue: HabitContextType = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitCompletionStatus,
    getHabitStreak,
  };

  return <HabitContext.Provider value={contextValue}>{children}</HabitContext.Provider>;
};