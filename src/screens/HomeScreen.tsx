import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useHabits } from '../contexts/HabitContext';
import HabitCard from '../components/HabitCard';
import QuoteCard from '../components/QuoteCard';
import Button from '../components/Button';
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from '../utils/theme';
import { getTodayFormatted, getCurrentDayOfWeek, getDayName } from '../utils/dateUtils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { habits } = useHabits();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [scrollY] = useState(new Animated.Value(0));
  const [todayHabits, setTodayHabits] = useState(habits);
  
  // Filter habits for today based on frequency
  useEffect(() => {
    const currentDay = getCurrentDayOfWeek();
    const filtered = habits.filter(habit => habit.frequency.days.includes(currentDay));
    setTodayHabits(filtered);
  }, [habits]);
  
  // Calculate completion percentage
  const completedCount = todayHabits.filter(habit => 
    habit.completedDates.includes(getTodayFormatted())
  ).length;
  
  const completionPercentage = todayHabits.length > 0 
    ? Math.round((completedCount / todayHabits.length) * 100) 
    : 0;
  
  // Animated header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });
  
  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
          <Text style={styles.day}>{getDayName(getCurrentDayOfWeek())}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${completionPercentage}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {completedCount}/{todayHabits.length} completed ({completionPercentage}%)
            </Text>
          </View>
        </Animated.View>
        
        <Animated.Text 
          style={[
            styles.title, 
            { transform: [{ scale: titleScale }] }
          ]}
        >
          My Habits
        </Animated.Text>
      </Animated.View>
      
      {/* Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Motivational Quote */}
        <QuoteCard />
        
        {/* Today's Habits */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllHabits')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {todayHabits.length > 0 ? (
          todayHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits scheduled for today</Text>
            <Text style={styles.emptySubText}>Add a new habit to get started</Text>
          </View>
        )}
        
        {/* Add Habit Button */}
        <Button
          title="Add New Habit"
          onPress={() => navigation.navigate('AddHabit')}
          style={styles.addButton}
          size="large"
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: SPACING.sm,
  },
  date: {
    fontSize: FONT_SIZES.md,
    color: COLORS.background,
    opacity: 0.8,
  },
  day: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: SPACING.md,
  },
  progressContainer: {
    marginTop: SPACING.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.background,
    marginTop: SPACING.xs,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    ...SHADOWS.small,
    marginBottom: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    marginTop: SPACING.lg,
  },
});

export default HomeScreen;