import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from './types';

// Notification configuration constants
const NOTIFICATION_STORAGE_PREFIX = '@habit_tracker:notifications:';
const MAX_NOTIFICATIONS_PER_HABIT = 7; // Maximum one per day
const ANDROID_CHANNEL_ID = 'habit-reminders';

// Platform-specific notification channel settings
const ANDROID_NOTIFICATION_CHANNEL = {
  name: 'Habit Reminders',
  description: 'Daily reminders for your habits',
  importance: Notifications.AndroidImportance.HIGH,
  enableVibrate: true,
  enableLights: true,
  lightColor: '#00F5A0',
  vibrationPattern: [0, 250, 250, 250],
};

/**
 * Configure notifications for the app
 */
export const configureNotifications = async (): Promise<boolean> => {
  try {
    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }
    
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Configure Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, ANDROID_NOTIFICATION_CHANNEL);
    }
    
    return true;
  } catch (error) {
    console.error('Error configuring notifications:', error);
    return false;
  }
};

/**
 * Schedule a notification for a habit reminder
 */
export const scheduleHabitReminder = async (
  habit: Habit
): Promise<string | null> => {
  try {
    if (!habit.reminder || !habit.reminder.enabled || !habit.reminder.time) {
      return null;
    }
    
    // Cancel any existing notification for this habit
    await cancelHabitReminder(habit.id);
    
    // Parse time (format: HH:MM)
    const [hours, minutes] = habit.reminder.time.split(':').map(Number);
    
    // Validate time values
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.error('Invalid time format:', habit.reminder.time);
      return null;
    }
    
    // Create trigger for daily notifications
    // Note: With 'daily' type, we schedule one notification per day at the specified time
    // The frequency.days logic should be handled by the app logic, not the trigger
    const trigger: Notifications.NotificationTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: hours * 3600 + minutes * 60,
      // TimeIntervalTriggerInput only accepts 'seconds' property
      repeats: true,
    };
    
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for: ${habit.name}`,
        body: habit.description || 'Time to complete your habit!',
        data: { habitId: habit.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
    
    const identifiers: string[] = [identifier];      
    
    // Store notification identifiers with the habit ID for later cancellation
    await storeNotificationIdentifiers(habit.id, identifiers);
    
    return habit.id;
  } catch (error) {
    console.error('Error scheduling habit reminder:', error);
    return null;
  }
};

/**
 * Cancel all notifications for a habit
 */
export const cancelHabitReminder = async (habitId: string): Promise<void> => {
  try {
    const identifiers = await getNotificationIdentifiers(habitId);
    
    if (identifiers && identifiers.length > 0) {
      for (const id of identifiers) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    }
    
    await removeNotificationIdentifiers(habitId);
  } catch (error) {
    console.error('Error canceling habit reminder:', error);
  }
};

/**
 * Get all scheduled notifications for debugging
 */
export const getAllScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Clear all habit notifications (useful for debugging)
 */
export const clearAllHabitNotifications = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const notificationKeys = keys.filter(key => key.startsWith(NOTIFICATION_STORAGE_PREFIX));
    
    for (const key of notificationKeys) {
      const habitId = key.replace(NOTIFICATION_STORAGE_PREFIX, '');
      await cancelHabitReminder(habitId);
    }
  } catch (error) {
    console.error('Error clearing all habit notifications:', error);
  }
};

// Helper functions to manage notification identifiers

async function storeNotificationIdentifiers(
  habitId: string,
  identifiers: string[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${NOTIFICATION_STORAGE_PREFIX}${habitId}`,
      JSON.stringify(identifiers)
    );
  } catch (error) {
    console.error('Error storing notification identifiers:', error);
  }
}

async function getNotificationIdentifiers(
  habitId: string
): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(`${NOTIFICATION_STORAGE_PREFIX}${habitId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting notification identifiers:', error);
    return [];
  }
}

async function removeNotificationIdentifiers(habitId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${NOTIFICATION_STORAGE_PREFIX}${habitId}`);
  } catch (error) {
    console.error('Error removing notification identifiers:', error);
  }
}