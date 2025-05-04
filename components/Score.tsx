import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScoreProps } from '../types/types';
import { Colors } from '../styles/colors';

const Score: React.FC<ScoreProps> = ({ score, highScore, combo }) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>High Score</Text>
        <Text style={styles.scoreValue}>{highScore}</Text>
      </View>
      {combo > 0 && (
        <View style={styles.comboContainer}>
          <Text style={styles.comboLabel}>Combo</Text>
          <Text style={styles.comboValue}>{combo}x</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.text,
    opacity: 0.8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  comboContainer: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  comboLabel: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
  },
  comboValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Score;
