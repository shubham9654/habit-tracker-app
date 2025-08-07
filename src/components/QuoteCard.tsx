import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, MOTIVATIONAL_QUOTES } from '../utils/theme';

const QuoteCard: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Get a random quote
  const getRandomQuote = (): string => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  };

  // Set a new quote and animate it
  const refreshQuote = () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Change quote
      setQuote(getRandomQuote());
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  // Set initial quote
  useEffect(() => {
    setQuote(getRandomQuote());
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Refresh quote every day
    const interval = setInterval(refreshQuote, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.quoteContainer, { opacity: fadeAnim }]}>
        <Text style={styles.quoteText}>"{quote}"</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  quoteContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  quoteText: {
    fontSize: FONT_SIZES.md,
    fontStyle: 'italic',
    color: COLORS.background,
    textAlign: 'center',
  },
});

export default QuoteCard;