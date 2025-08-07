import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { HabitProvider } from './src/contexts/HabitContext';
import { configureNotifications } from './src/utils/notifications';

export default function App() {
  // Configure notifications on app start
  useEffect(() => {
    const setupNotifications = async () => {
      await configureNotifications();
    };
    
    setupNotifications();
  }, []);
  
  return (
    <HabitProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </HabitProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
