import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from './types';

const HABITS_STORAGE_KEY = '@habit_tracker:habits';

/**
 * Save habits to AsyncStorage
 */
export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(habits);
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving habits:', error);
    throw error;
  }
};

/**
 * Load habits from AsyncStorage
 */
export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

/**
 * Clear all habits from AsyncStorage
 */
export const clearHabits = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HABITS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing habits:', error);
    throw error;
  }
};