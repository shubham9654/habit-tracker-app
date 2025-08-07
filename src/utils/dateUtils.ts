/**
 * Date utility functions for the habit tracker app
 */

/**
 * Format a date to YYYY-MM-DD string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};

/**
 * Get the day of week (0-6, where 0 is Sunday)
 */
export const getDayOfWeek = (date: Date): number => {
  return date.getDay();
};

/**
 * Get the current day of week
 */
export const getCurrentDayOfWeek = (): number => {
  return getDayOfWeek(new Date());
};

/**
 * Check if a habit should be active today based on its frequency
 */
export const isHabitActiveToday = (frequencyDays: number[]): boolean => {
  const today = getCurrentDayOfWeek();
  return frequencyDays.includes(today);
};

/**
 * Get a date object from a YYYY-MM-DD string
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Get an array of dates for the last n days
 */
export const getLastNDays = (n: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < n; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

/**
 * Calculate streak of consecutive days
 */
export const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  // Sort dates in descending order
  const sortedDates = [...completedDates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  let streak = 1;
  const today = getTodayFormatted();
  const yesterday = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  
  // Check if today or yesterday is completed to start counting streak
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }
  
  // Count consecutive days
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentDate = parseDate(sortedDates[i]);
    const nextDate = parseDate(sortedDates[i + 1]);
    
    const diffTime = currentDate.getTime() - nextDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (Math.round(diffDays) === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Get day name from day number
 */
export const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
};

/**
 * Get short day name from day number
 */
export const getShortDayName = (dayNumber: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayNumber];
};