import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  // Determine button styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    let buttonStyle: ViewStyle = {};

    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: COLORS.primary,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: COLORS.secondary,
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.primary,
        };
        break;
      case 'text':
        buttonStyle = {
          backgroundColor: 'transparent',
        };
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.md,
          borderRadius: BORDER_RADIUS.sm,
        };
        break;
      case 'medium':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
          borderRadius: BORDER_RADIUS.md,
        };
        break;
      case 'large':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xl,
          borderRadius: BORDER_RADIUS.lg,
        };
        break;
    }

    // Disabled state
    if (disabled) {
      buttonStyle = {
        ...buttonStyle,
        opacity: 0.5,
      };
    }

    return buttonStyle;
  };

  // Determine text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    let textStyleObj: TextStyle = {
      fontWeight: '600',
    };

    // Variant styles
    switch (variant) {
      case 'primary':
      case 'secondary':
        textStyleObj = {
          ...textStyleObj,
          color: COLORS.background,
        };
        break;
      case 'outline':
      case 'text':
        textStyleObj = {
          ...textStyleObj,
          color: COLORS.primary,
        };
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        textStyleObj = {
          ...textStyleObj,
          fontSize: FONT_SIZES.sm,
        };
        break;
      case 'medium':
        textStyleObj = {
          ...textStyleObj,
          fontSize: FONT_SIZES.md,
        };
        break;
      case 'large':
        textStyleObj = {
          ...textStyleObj,
          fontSize: FONT_SIZES.lg,
        };
        break;
    }

    return textStyleObj;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, getButtonStyles(), style]}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? COLORS.background : COLORS.primary}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[styles.text, getTextStyles(), textStyle]}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  text: {
    textAlign: 'center',
    marginHorizontal: SPACING.xs,
  },
});

export default Button;