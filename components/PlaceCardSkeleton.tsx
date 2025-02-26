import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function PlaceCardSkeleton() {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <View style={styles.image} />
      <View style={styles.content}>
        <View style={styles.title} />
        <View style={styles.address} />
        <View style={styles.rating} />
        <View style={styles.features}>
          <View style={styles.feature} />
          <View style={styles.feature} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    height: 24,
    width: '70%',
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
  },
  address: {
    height: 16,
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
  },
  rating: {
    height: 16,
    width: '30%',
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
  },
  features: {
    flexDirection: 'row',
    gap: 8,
  },
  feature: {
    height: 24,
    width: 80,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
});