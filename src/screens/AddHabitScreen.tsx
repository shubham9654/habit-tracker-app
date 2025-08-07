import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useHabits } from '../contexts/HabitContext';
import Button from '../components/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/theme';
import { getShortDayName } from '../utils/dateUtils';

type AddHabitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;

const AddHabitScreen: React.FC = () => {
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const { addHabit } = useHabits();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState(COLORS.habitColors[0]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  
  // Toggle day selection
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  // Handle time input
  const handleTimeChange = (time: string) => {
    setReminderTime(time);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }
    
    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }
    
    // Create new habit
    addHabit({
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
      frequency: {
        days: selectedDays,
      },
      reminder: reminderEnabled ? {
        time: reminderTime,
        enabled: true,
      } : undefined,
    });
    
    // Navigate back to home screen
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Add New Habit</Text>
          
          {/* Habit Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Habit Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Drink Water, Read, Exercise"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          
          {/* Habit Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add details about your habit"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          {/* Frequency */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Frequency *</Text>
            <Text style={styles.sublabel}>Select days to perform this habit</Text>
            
            <View style={styles.daysContainer}>
              {[0, 1, 2, 3, 4, 5, 6].map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) && styles.dayButtonTextSelected,
                    ]}
                  >
                    {getShortDayName(day)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Color Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorContainer}>
              {COLORS.habitColors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorButtonSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>
          
          {/* Reminder */}
          <View style={styles.inputContainer}>
            <View style={styles.reminderHeader}>
              <Text style={styles.label}>Daily Reminder</Text>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: COLORS.disabled, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>
            
            {reminderEnabled && (
              <View style={styles.timeInputContainer}>
                <Text style={styles.sublabel}>Reminder Time</Text>
                <TextInput
                  style={styles.timeInput}
                  value={reminderTime}
                  onChangeText={handleTimeChange}
                  placeholder="HH:MM"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            )}
          </View>
          
          {/* Submit Button */}
          <Button
            title="Create Habit"
            onPress={handleSubmit}
            style={styles.submitButton}
            size="large"
          />
          
          {/* Cancel Button */}
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="text"
            style={styles.cancelButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sublabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: COLORS.background,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: COLORS.background,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInputContainer: {
    marginTop: SPACING.md,
  },
  timeInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    width: '50%',
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
  cancelButton: {
    marginTop: SPACING.md,
  },
});

export default AddHabitScreen;