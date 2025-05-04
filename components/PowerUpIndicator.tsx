import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PowerUp } from '../types/types';
import { Colors } from '../styles/colors';

interface PowerUpIndicatorProps {
  type: PowerUp;
  timeLeft: number;
}

const PowerUpIndicator: React.FC<PowerUpIndicatorProps> = ({ type, timeLeft }) => {
  const getPowerUpColor = () => {
    switch (type) {
      case PowerUp.Speed:
        return '#4CAF50';
      case PowerUp.Slow:
        return '#2196F3';
      case PowerUp.DoublePoints:
        return '#FFC107';
      default:
        return Colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getPowerUpColor() }]}>
      <Text style={styles.text}>{type}</Text>
      <Text style={styles.timeLeft}>{Math.ceil(timeLeft / 1000)}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeLeft: {
    color: '#fff',
    fontSize: 12,
  },
});

export default PowerUpIndicator; 