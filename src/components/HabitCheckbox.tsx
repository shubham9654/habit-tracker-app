import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../utils/theme';

interface HabitCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const HabitCheckbox: React.FC<HabitCheckboxProps> = ({
  checked,
  onToggle,
  disabled = false,
  size = 24,
  color = COLORS.primary,
  style,
}) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkScaleAnim = useRef(new Animated.Value(0)).current;

  // Update animation when checked state changes
  useEffect(() => {
    if (checked) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(checkmarkScaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(checkmarkScaleAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [checked]);

  // Handle press animation
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      style={[style, { opacity: disabled ? 0.5 : 1 }]}
    >
      <Animated.View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderRadius: size / 4,
            borderColor: color,
            backgroundColor: checked ? color : 'transparent',
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {checked && (
          <Animated.View
            style={[
              styles.checkmark,
              {
                width: size * 0.5,
                height: size * 0.5,
                borderRadius: (size * 0.5) / 4,
                backgroundColor: COLORS.background,
                transform: [{ scale: checkmarkScaleAnim }],
              },
            ]}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  checkmark: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HabitCheckbox;