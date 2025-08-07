import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useHabits } from '../contexts/HabitContext';
import HabitCard from '../components/HabitCard';
import Button from '../components/Button';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';

type AllHabitsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllHabits'>;

const AllHabitsScreen: React.FC = () => {
  const navigation = useNavigation<AllHabitsScreenNavigationProp>();
  const { habits } = useHabits();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Habits</Text>
      </View>
      
      {habits.length > 0 ? (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
            />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No habits added yet</Text>
          <Text style={styles.emptySubText}>Add your first habit to get started</Text>
          <Button
            title="Add New Habit"
            onPress={() => navigation.navigate('AddHabit')}
            style={styles.addButton}
          />
        </View>
      )}
      
      {habits.length > 0 && (
        <View style={styles.floatingButtonContainer}>
          <Button
            title="+ Add New Habit"
            onPress={() => navigation.navigate('AddHabit')}
            style={styles.floatingButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  addButton: {
    minWidth: 200,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    left: SPACING.lg,
  },
  floatingButton: {
    borderRadius: SPACING.lg,
  },
});

export default AllHabitsScreen;