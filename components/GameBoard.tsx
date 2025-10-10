import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../styles/colors';
import { settings_isRondedEdges } from '@/lib/settings';
import { Coordinate, FoodType, PowerUp } from '../types/types';
import { PowerUpState } from '../lib/gameConstants';
import Snake from './Snake';
import Food from './Food';
import PowerUpIndicator from './PowerUpIndicator';
import ComboIndicator from './ComboIndicator';
import PoisonOverlay from './PoisonOverlay';

interface GameBoardProps {
  snake: Coordinate[];
  food: Coordinate;
  foodType: FoodType;
  powerUp: PowerUpState;
  combo: number;
  comboAnimation: Animated.Value;
  poisonEffect: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  foodType,
  powerUp,
  combo,
  comboAnimation,
  poisonEffect,
}) => {
  return (
    <View style={styles.boundaries}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gridBackground}
      />
      
      <PoisonOverlay isVisible={poisonEffect} />
      
      <Snake snake={snake} />
      
      <Food x={food.x} y={food.y} type={foodType} />
      
      {powerUp.type && (
        <PowerUpIndicator
          type={powerUp.type}
          timeLeft={Math.max(0, powerUp.endTime - Date.now())}
        />
      )}
      
      <ComboIndicator combo={combo} comboAnimation={comboAnimation} />
    </View>
  );
};

const styles = StyleSheet.create({
  boundaries: {
    flex: 1,
    margin: 15,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderRadius: settings_isRondedEdges() ? 30 : 0,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
});

export default GameBoard;