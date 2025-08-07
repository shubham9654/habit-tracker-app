import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Habit } from '../utils/types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { useHabits } from '../contexts/HabitContext';
import { getTodayFormatted, isHabitActiveToday } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
  const { toggleHabitCompletion, getHabitCompletionStatus } = useHabits();
  const isCompleted = getHabitCompletionStatus(habit.id, getTodayFormatted());
  const isActive = isHabitActiveToday(habit.frequency.days);
  
  // Animation for completion
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handleToggleCompletion = () => {
    // Animate the card when toggling completion
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    
    toggleHabitCompletion(habit.id, getTodayFormatted());
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
        { backgroundColor: habit.color || COLORS.primary },
        !isActive && styles.inactiveContainer,
      ]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.habitInfo}>
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
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        onPress={handleToggleCompletion}
        disabled={!isActive}
      >
        {isCompleted && <View style={styles.checkmark} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  inactiveContainer: {
    opacity: 0.6,
  },
  cardContent: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  habitName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  habitDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.background,
    opacity: 0.8,
  },
  streakContainer: {
    marginTop: SPACING.sm,
  },
  streakText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.background,
    fontWeight: '500',
  },
  checkbox: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.background,
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.xs,
    backgroundColor: COLORS.primary,
  },
});

export default HabitCard;