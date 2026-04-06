import { useEffect, useCallback } from "react";
import { useGameState } from "./useGameState";
import { useComboSystem } from "./useComboSystem";
import { useGestureHandler } from "./useGestureHandler";
import { useGameLoop } from "./useGameLoop";
import { GameBounds, GAME_UNIT_SIZE } from "../lib/gameConstants";
import { GestureEventType } from "../types/types";
import { useScoreStore } from "@/lib/scoreStore";
import useSettingStore from "@/lib/settings";
import { backgroundMusic } from "@/lib/utils";

interface UseGameOptions {
  boardWidth: number;
  boardHeight: number;
}

export const useGame = ({ boardWidth, boardHeight }: UseGameOptions) => {
  const { settings } = useSettingStore();
  const { highScore, addScore } = useScoreStore();

  // Calculate game bounds from actual playable area dimensions.
  // Fall back to 0 until the board has been measured so the game loop
  // doesn't start with incorrect bounds.
  // Grid cells are 0-indexed: a board that is N*GAME_UNIT_SIZE px wide
  // contains cells 0..(N-1), so xMax = floor(boardWidth/GAME_UNIT_SIZE)-1.
  const gameBounds: GameBounds = {
    xMin: 0,
    xMax: boardWidth > 0 ? Math.floor(boardWidth / GAME_UNIT_SIZE) - 1 : 0,
    yMin: 0,
    yMax: boardHeight > 0 ? Math.floor(boardHeight / GAME_UNIT_SIZE) - 1 : 0,
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
    checkPowerUpExpiration: gameState.checkPowerUpExpiration,
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
