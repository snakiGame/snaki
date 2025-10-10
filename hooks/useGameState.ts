import { useState, useCallback, useEffect } from "react";
import { Direction, Coordinate, PowerUp, FoodType } from "../types/types";
import {
  INITIAL_GAME_STATE,
  PowerUpState,
  DIFFICULTY_LEVELS,
  BASE_MOVE_INTERVAL,
  POWER_UP_DURATION,
} from "../lib/gameConstants";

export const useGameState = () => {
  const [direction, setDirection] = useState<Direction>(
    INITIAL_GAME_STATE.direction
  );
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_GAME_STATE.snake);
  const [food, setFood] = useState<Coordinate>(INITIAL_GAME_STATE.food);
  const [foodType, setFoodType] = useState<FoodType>(
    INITIAL_GAME_STATE.foodType
  );
  const [score, setScore] = useState<number>(INITIAL_GAME_STATE.score);
  const [isGameOver, setIsGameOver] = useState<boolean>(
    INITIAL_GAME_STATE.isGameOver
  );
  const [isPaused, setIsPaused] = useState<boolean>(
    INITIAL_GAME_STATE.isPaused
  );
  const [combo, setCombo] = useState<number>(INITIAL_GAME_STATE.combo);
  const [powerUp, setPowerUp] = useState<PowerUpState>({
    type: null,
    endTime: 0,
  });
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(
    INITIAL_GAME_STATE.speedMultiplier
  );
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(
    INITIAL_GAME_STATE.currentDifficulty
  );
  const [poisonEffect, setPoisonEffect] = useState<boolean>(
    INITIAL_GAME_STATE.poisonEffect
  );
  const [lastFoodTime, setLastFoodTime] = useState<number>(0);

  // Calculate current move interval based on score and difficulty levels
  const getCurrentMoveInterval = useCallback(() => {
    const currentLevel = [...DIFFICULTY_LEVELS]
      .reverse()
      .find((level) => score >= level.score);

    const difficultyIndex = DIFFICULTY_LEVELS.findIndex(
      (level: { score: number; interval: number }) =>
        level.interval === currentLevel?.interval
    );
    setCurrentDifficulty(difficultyIndex + 1);

    return (currentLevel?.interval || BASE_MOVE_INTERVAL) / speedMultiplier;
  }, [score, speedMultiplier]);

  // Handle power-ups
  const activatePowerUp = useCallback((type: PowerUp) => {
    setPowerUp({ type, endTime: Date.now() + POWER_UP_DURATION });
    switch (type) {
      case PowerUp.Speed:
        setSpeedMultiplier(1.5);
        break;
      case PowerUp.Slow:
        setSpeedMultiplier(0.7);
        break;
      case PowerUp.DoublePoints:
        // Handled in score calculation
        break;
    }
  }, []);

  // Reset power-ups when they expire
  useEffect(() => {
    if (powerUp.type && Date.now() > powerUp.endTime) {
      setPowerUp({ type: null, endTime: 0 });
      setSpeedMultiplier(1);
    }
  }, [powerUp]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_GAME_STATE.snake);
    setFood(INITIAL_GAME_STATE.food);
    setFoodType(INITIAL_GAME_STATE.foodType);
    setDirection(INITIAL_GAME_STATE.direction);
    setScore(INITIAL_GAME_STATE.score);
    setCombo(INITIAL_GAME_STATE.combo);
    setIsGameOver(INITIAL_GAME_STATE.isGameOver);
    setIsPaused(INITIAL_GAME_STATE.isPaused);
    setPowerUp({ type: null, endTime: 0 });
    setSpeedMultiplier(INITIAL_GAME_STATE.speedMultiplier);
    setCurrentDifficulty(INITIAL_GAME_STATE.currentDifficulty);
    setPoisonEffect(INITIAL_GAME_STATE.poisonEffect);
    setLastFoodTime(0);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  return {
    // State
    direction,
    snake,
    food,
    foodType,
    score,
    isGameOver,
    isPaused,
    combo,
    powerUp,
    speedMultiplier,
    currentDifficulty,
    poisonEffect,
    lastFoodTime,

    // State setters
    setDirection,
    setSnake,
    setFood,
    setFoodType,
    setScore,
    setIsGameOver,
    setCombo,
    setPoisonEffect,
    setLastFoodTime,

    // Computed values
    getCurrentMoveInterval,

    // Actions
    activatePowerUp,
    resetGame,
    togglePause,
  };
};
