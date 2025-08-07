import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useHabits } from '../contexts/HabitContext';
import Button from '../components/Button';
import HabitCheckbox from '../components/HabitCheckbox';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { getLastNDays, formatDate, parseDate, getDayName } from '../utils/dateUtils';

type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;
type HabitDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HabitDetail'>;

const HabitDetailScreen: React.FC = () => {
  const route = useRoute<HabitDetailScreenRouteProp>();
  const navigation = useNavigation<HabitDetailScreenNavigationProp>();
  const { habitId } = route.params;
  const { habits, toggleHabitCompletion, getHabitCompletionStatus, deleteHabit } = useHabits();
  
  // Find the habit
  const habit = habits.find(h => h.id === habitId);
  
  // Get last 7 days for history
  const last7Days = getLastNDays(7);
  
  // Handle delete habit
  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit?.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteHabit(habitId);
            navigation.goBack();
          }
        },
      ]
    );
  };
  
  // If habit not found, show error
  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Habit not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: habit.color || COLORS.primary }]}>
          <Text style={styles.habitName}>{habit.name}</Text>
          {habit.description && (
            <Text style={styles.habitDescription}>{habit.description}</Text>
          )}
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>
              {habit.streak > 0 ? `🔥 ${habit.streak} day streak` : 'Start your streak today!'}
            </Text>
          </View>
        </View>
        
        {/* Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <View style={styles.daysContainer}>
            {[0, 1, 2, 3, 4, 5, 6].map(day => (
              <View
                key={day}
                style={[
                  styles.dayIndicator,
                  habit.frequency.days.includes(day) && styles.activeDayIndicator,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    habit.frequency.days.includes(day) && styles.activeDayText,
                  ]}
                >
                  {getDayName(day).charAt(0)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Reminder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder</Text>
          <Text style={styles.reminderText}>
            {habit.reminder && habit.reminder.enabled
              ? `Daily at ${habit.reminder.time}`
              : 'No reminder set'}
          </Text>
        </View>
        
        {/* Recent History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent History</Text>
          <View style={styles.historyContainer}>
            {last7Days.map(date => {
              const isCompleted = getHabitCompletionStatus(habitId, date);
              const dayName = getDayName(parseDate(date).getDay()).substring(0, 3);
              const isToday = date === formatDate(new Date());
              
              return (
                <View key={date} style={styles.historyItem}>
                  <Text style={[styles.historyDate, isToday && styles.todayText]}>
                    {dayName}
                  </Text>
                  <Text style={styles.historyDateNumber}>
                    {parseDate(date).getDate()}
                  </Text>
                  <HabitCheckbox
                    checked={isCompleted}
                    onToggle={() => toggleHabitCompletion(habitId, date)}
                    color={habit.color || COLORS.primary}
                    style={styles.historyCheckbox}
                  />
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Edit Habit"
            onPress={() => navigation.navigate('EditHabit', { habitId })}
            style={styles.editButton}
          />
          <Button
            title="Delete Habit"
            onPress={handleDeleteHabit}
            variant="outline"
            style={styles.deleteButton}
            textStyle={{ color: COLORS.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  habitName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  habitDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.background,
    opacity: 0.9,
    marginBottom: SPACING.md,
  },
  streakContainer: {
    marginTop: SPACING.sm,
  },
  streakText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.background,
    fontWeight: '500',
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayIndicator: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDayIndicator: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeDayText: {
    color: COLORS.background,
  },
  reminderText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  historyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyItem: {
    alignItems: 'center',
  },
  historyDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  historyDateNumber: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  todayText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  historyCheckbox: {
    marginTop: SPACING.xs,
  },
  actionsContainer: {
    marginTop: SPACING.lg,
  },
  editButton: {
    marginBottom: SPACING.md,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.error,
    marginBottom: SPACING.lg,
  },
  backButton: {
    minWidth: 150,
  },
});

export default HabitDetailScreen;