import { useEffect, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { useGameState } from "./useGameState";
import { useComboSystem } from "./useComboSystem";
import { useGestureHandler } from "./useGestureHandler";
import { useGameLoop } from "./useGameLoop";
import { GameBounds, BORDER_WIDTH, GAME_UNIT_SIZE } from "../lib/gameConstants";
import { GestureEventType } from "../types/types";
import { useScoreStore } from "@/lib/scoreStore";
import useSettingStore from "@/lib/settings";
import { backgroundMusic } from "@/lib/utils";

export const useGame = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { settings } = useSettingStore();
  const { highScore, addScore } = useScoreStore();

  // actual game area dimensions accounting for UI elements
  const calculateGameBounds = useCallback((): GameBounds => {
    // Account for all the UI elements that reduce the actual game area
    const HEADER_HEIGHT = 60; // Approximate header height
    const GAMEBOARD_MARGIN = 15; // GameBoard margin from styles
    const GAMEBOARD_BORDER = 2; // GameBoard border width
    const BOTTOM_PADDING = 20; // Some padding at the bottom

    // available width (full screen width minus GameBoard margins and borders)
    const availableWidth =
      screenWidth - GAMEBOARD_MARGIN * 2 - GAMEBOARD_BORDER * 2;

    // available height (screen height minus safe areas, header, GameBoard margins/borders, and padding)
    const availableHeight =
      screenHeight -
      insets.top -
      insets.bottom -
      HEADER_HEIGHT -
      GAMEBOARD_MARGIN * 2 -
      GAMEBOARD_BORDER * 2 -
      BOTTOM_PADDING;

    return {
      xMin: 0,
      xMax: Math.floor(availableWidth / GAME_UNIT_SIZE) - 1, // -1 to prevent edge collision
      yMin: 0,
      yMax: Math.floor(availableHeight / GAME_UNIT_SIZE) - 1, // -1 to prevent edge collision
    };
  }, [screenWidth, screenHeight, insets]);

  const gameBounds = calculateGameBounds();

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
  const handleGesture = useCallback(
    (event: GestureEventType) => {
      gestureHandler.handleGesture(
        event,
        gameState.direction,
        gameState.setDirection
      );
    },
    [gestureHandler, gameState.direction, gameState.setDirection]
  );

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
