/**
 * Navigation types for the app
 */

export type RootStackParamList = {
  Home: undefined;
  AllHabits: undefined;
  AddHabit: undefined;
  EditHabit: { habitId: string };
  HabitDetail: { habitId: string };
};