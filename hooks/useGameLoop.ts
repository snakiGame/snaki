import { useEffect, useCallback } from "react";
import { Vibration } from "react-native";
import { Direction, Coordinate, FoodType, PowerUp } from "../types/types";
import { GameBounds } from "../lib/gameConstants";
import { checkEatsFood } from "../utils/checkEatsFood";
import { checkGameOver } from "../utils/checkGameOver";
import { randomFoodPosition } from "../utils/randomFoodPosition";
import {
  SCORE_INCREMENT,
  SCORE_MULTIPLIERS,
  FOOD_PROBABILITIES,
  VIBRATION_PATTERNS,
} from "../lib/gameConstants";

interface UseGameLoopProps {
  snake: Coordinate[];
  direction: Direction;
  food: Coordinate;
  foodType: FoodType;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  combo: number;
  powerUpType: PowerUp | null;
  gameBounds: GameBounds;
  localHighScore: number;
  vibrationEnabled: boolean;

  // State setters
  setSnake: (snake: Coordinate[]) => void;
  setFood: (food: Coordinate) => void;
  setFoodType: (type: FoodType) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setIsGameOver: (gameOver: boolean) => void;
  setPoisonEffect: (effect: boolean) => void;

  // Actions
  getCurrentMoveInterval: () => number;
  updateCombo: (
    combo: number,
    lastFoodTime: number,
    setCombo: (combo: number) => void,
    setLastFoodTime: (time: number) => void
  ) => void;
  resetCombo: (setCombo: (combo: number) => void) => void;
  calculateScore: (
    baseScore: number,
    combo: number,
    powerUpType: PowerUp | null
  ) => number;
  activatePowerUp: (type: PowerUp) => void;
  addScore: (score: number) => void;
  setCombo: (combo: number) => void;
  setLastFoodTime: (time: number) => void;
  lastFoodTime: number;
}

export const useGameLoop = ({
  snake,
  direction,
  food,
  foodType,
  score,
  isGameOver,
  isPaused,
  combo,
  powerUpType,
  gameBounds,
  localHighScore,
  vibrationEnabled,
  setSnake,
  setFood,
  setFoodType,
  setScore,
  setIsGameOver,
  setPoisonEffect,
  getCurrentMoveInterval,
  updateCombo,
  resetCombo,
  calculateScore,
  activatePowerUp,
  addScore,
  setCombo,
  setLastFoodTime,
  lastFoodTime,
}: UseGameLoopProps) => {
  const vibrate = useCallback(
    async (length: number) => {
      if (!vibrationEnabled) return;
      Vibration.vibrate(length);
    },
    [vibrationEnabled]
  );

  const moveSnake = useCallback(() => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead };

    if (checkGameOver(snakeHead, gameBounds, snake)) {
      if (score > localHighScore) {
        addScore(score);
      }
      setIsGameOver(true);
      vibrate(VIBRATION_PATTERNS.gameOver);
      return;
    }

    switch (direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
    }

    if (checkEatsFood(newHead, food, 2)) {
      handleFoodEaten(newHead);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  }, [
    snake,
    direction,
    food,
    foodType,
    gameBounds,
    score,
    localHighScore,
    combo,
    powerUpType,
    vibrate,
    setSnake,
    setFood,
    setFoodType,
    setScore,
    setIsGameOver,
    setPoisonEffect,
    updateCombo,
    resetCombo,
    calculateScore,
    activatePowerUp,
    addScore,
    setCombo,
    setLastFoodTime,
    lastFoodTime,
  ]);

  const handleFoodEaten = useCallback(
    (newHead: Coordinate) => {
      if (foodType === FoodType.Poison) {
        // Poison food has negative effects
        vibrate(VIBRATION_PATTERNS.poison);

        // Reduce score
        setScore((prev) => Math.max(0, prev + SCORE_MULTIPLIERS.poison));

        // Shrink snake if possible (don't go below length 1)
        if (snake.length > 1) {
          setSnake([newHead, ...snake.slice(0, -2)]);
        } else {
          setSnake([newHead]);
        }

        // Reset combo
        resetCombo(setCombo);

        // Show poison effect
        setPoisonEffect(true);
        setTimeout(() => setPoisonEffect(false), 1000);
      } else {
        // Normal food behavior
        setSnake([newHead, ...snake]);
        vibrate(VIBRATION_PATTERNS.foodEaten);
        updateCombo(combo, lastFoodTime, setCombo, setLastFoodTime);

        // Different score based on food type
        let scoreIncrement = SCORE_INCREMENT;
        if (foodType === FoodType.Golden) {
          scoreIncrement = SCORE_MULTIPLIERS.golden;
        } else if (foodType === FoodType.Rainbow) {
          scoreIncrement = SCORE_MULTIPLIERS.rainbow;
        }

        setScore(
          (prev) => prev + calculateScore(scoreIncrement, combo, powerUpType)
        );
      }

      // Random chance for special food or power-up
      const random = Math.random();
      if (random < FOOD_PROBABILITIES.powerUp) {
        const powerUps = Object.values(PowerUp);
        const randomPowerUp =
          powerUps[Math.floor(Math.random() * powerUps.length)];
        activatePowerUp(randomPowerUp);
      } else if (random < FOOD_PROBABILITIES.special) {
        const foodTypes = Object.values(FoodType);
        setFoodType(foodTypes[Math.floor(Math.random() * foodTypes.length)]);
      } else {
        setFoodType(FoodType.Normal);
      }

      setFood(randomFoodPosition(gameBounds.xMax, gameBounds.yMax));
    },
    [
      foodType,
      snake,
      combo,
      powerUpType,
      gameBounds,
      vibrate,
      setSnake,
      setFood,
      setFoodType,
      setScore,
      setPoisonEffect,
      updateCombo,
      resetCombo,
      calculateScore,
      activatePowerUp,
      setCombo,
      setLastFoodTime,
      lastFoodTime,
    ]
  );

  // Game loop effect
  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        !isPaused && moveSnake();
      }, getCurrentMoveInterval());
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused, getCurrentMoveInterval, moveSnake]);

  return {
    moveSnake,
    vibrate,
  };
};
