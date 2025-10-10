import { useEffect, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useGameState } from './useGameState';
import { useComboSystem } from './useComboSystem';
import { useGestureHandler } from './useGestureHandler';
import { useGameLoop } from './useGameLoop';
import { GameBounds, BORDER_WIDTH, GAME_UNIT_SIZE } from '../lib/gameConstants';
import { GestureEventType } from '../types/types';
import { useScoreStore } from '@/lib/scoreStore';
import useSettingStore from '@/lib/settings';
import { backgroundMusic } from '@/lib/utils';

export const useGame = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { settings } = useSettingStore();
  const { highScore, addScore } = useScoreStore();

  // Calculate game bounds
  const gameBounds: GameBounds = {
    xMin: 0,
    xMax: Math.floor((screenWidth - (BORDER_WIDTH * 2)) / GAME_UNIT_SIZE),
    yMin: 0,
    yMax: Math.floor((screenHeight - (BORDER_WIDTH * 2)) / GAME_UNIT_SIZE),
  };

  // Initialize hooks
  const gameState = useGameState();
  const comboSystem = useComboSystem();
  const gestureHandler = useGestureHandler();

  // Game loop hook
  const { vibrate } = useGameLoop({
    snake: gameState.snake,
    direction: gameState.direction,
    food: gameState.food,
    foodType: gameState.foodType,
    score: gameState.score,
    isGameOver: gameState.isGameOver,
    isPaused: gameState.isPaused,
    combo: gameState.combo,
    powerUpType: gameState.powerUp.type,
    gameBounds,
    localHighScore: highScore,
    vibrationEnabled: settings.vibration,
    
    setSnake: gameState.setSnake,
    setFood: gameState.setFood,
    setFoodType: gameState.setFoodType,
    setScore: gameState.setScore,
    setIsGameOver: gameState.setIsGameOver,
    setPoisonEffect: gameState.setPoisonEffect,
    
    getCurrentMoveInterval: gameState.getCurrentMoveInterval,
    updateCombo: comboSystem.updateCombo,
    resetCombo: comboSystem.resetCombo,
    calculateScore: comboSystem.calculateScore,
    activatePowerUp: gameState.activatePowerUp,
    addScore,
    setCombo: gameState.setCombo,
    setLastFoodTime: gameState.setLastFoodTime,
    lastFoodTime: gameState.lastFoodTime,
  });

  // Handle gesture
  const handleGesture = useCallback((event: GestureEventType) => {
    gestureHandler.handleGesture(event, gameState.direction, gameState.setDirection);
  }, [gestureHandler, gameState.direction, gameState.setDirection]);

  // Initialize background music
  useEffect(() => {
    backgroundMusic();
  }, []);

  return {
    // Game state
    ...gameState,
    gameBounds,
    localHighScore: highScore,
    
    // Combo system
    comboAnimation: comboSystem.comboAnimation,
    
    // Actions
    handleGesture,
    vibrate,
  };
};