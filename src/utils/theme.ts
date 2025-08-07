/**
 * Theme configuration for the habit tracker app
 */

export const COLORS = {
  primary: '#6200EE',
  primaryDark: '#3700B3',
  primaryLight: '#BB86FC',
  secondary: '#03DAC6',
  secondaryDark: '#018786',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  text: '#000000',
  textSecondary: '#757575',
  disabled: '#BDBDBD',
  divider: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Habit colors
  habitColors: [
    '#6200EE', // Purple
    '#03DAC6', // Teal
    '#FF5722', // Deep Orange
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Amber
    '#E91E63', // Pink
    '#607D8B', // Blue Grey
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
  ],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  bold: '700',
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Motivational quotes for the app
export const MOTIVATIONAL_QUOTES = [
  'The secret of getting ahead is getting started.',
  'Small daily improvements are the key to staggering long-term results.',
  'Habits are the compound interest of self-improvement.',
  'You don\'t have to be great to start, but you have to start to be great.',
  'The only bad workout is the one that didn\'t happen.',
  'It\'s not about being the best. It\'s about being better than you were yesterday.',
  'Motivation is what gets you started. Habit is what keeps you going.',
  'Success is the sum of small efforts, repeated day in and day out.',
  'The difference between try and triumph is just a little umph!',
  'Don\'t count the days, make the days count.',
  'The only way to do great work is to love what you do.',
  'Your habits will determine your future.',
  'Discipline is choosing between what you want now and what you want most.',
  'The best way to predict your future is to create it.',
  'You are never too old to set another goal or to dream a new dream.',
];