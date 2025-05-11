import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScoreProps } from '../types/types';
import { Colors } from '../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const Score: React.FC<ScoreProps> = ({ score, combo, onHighScorePress, difficulty }) => {
  // Function to get difficulty color
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 1: return '#4CAF50'; // Green for easy
      case 2: return '#FFC107'; // Yellow for medium
      case 3: return '#FF9800'; // Orange for hard
      case 4: return '#F44336'; // Red for very hard
      default: return '#4CAF50';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
      {combo > 0 && (
        <LinearGradient
          colors={[Colors.accents, 'rgba(255, 255, 255, 0.1)']}
          style={styles.comboContainer}
        >
          <Text style={styles.comboLabel}>Combo</Text>
          <Text style={styles.comboValue}>{combo}x</Text>
        </LinearGradient>
      )}
      {difficulty && (
        <View style={[styles.difficultyContainer, { borderColor: getDifficultyColor() }]}>
          <Text style={styles.difficultyLabel}>Level</Text>
          <View style={styles.difficultyValueContainer}>
            <Text style={styles.difficultyValue}>{difficulty}</Text>
            <FontAwesome 
              name="fire" 
              size={12} 
              color={getDifficultyColor()} 
              style={styles.difficultyIcon} 
            />
          </View>
        </View>
      )}
      <TouchableOpacity onPress={onHighScorePress} style={styles.highScoreButton}>
        <Text style={styles.highScoreButtonText}>🏆</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  comboContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accents,
  },
  comboLabel: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
    fontWeight: '500',
  },
  comboValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  difficultyContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  difficultyLabel: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
    fontWeight: '500',
  },
  difficultyValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  difficultyIcon: {
    marginTop: 1,
  },
  highScoreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highScoreButtonText: {
    fontSize: 16,
  },
});

export default Score;
