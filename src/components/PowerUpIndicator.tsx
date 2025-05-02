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
        return '#FFD700'; // Gold
      case PowerUp.Slow:
        return '#4169E1'; // Royal Blue
      case PowerUp.DoublePoints:
        return '#FF69B4'; // Hot Pink
      default:
        return Colors.primary;
    }
  };

  const getPowerUpText = () => {
    switch (type) {
      case PowerUp.Speed:
        return 'SPEED BOOST';
      case PowerUp.Slow:
        return 'SLOW MOTION';
      case PowerUp.DoublePoints:
        return '2x POINTS';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getPowerUpColor() }]}>
      <Text style={styles.text}>{getPowerUpText()}</Text>
      <Text style={styles.timer}>{Math.ceil(timeLeft / 1000)}s</Text>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  timer: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PowerUpIndicator; 