import { useEffect, useCallback, useRef } from "react";
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
  checkPowerUpExpiration: () => void;
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
  checkPowerUpExpiration,
  addScore,
  setCombo,
  setLastFoodTime,
  lastFoodTime,
}: UseGameLoopProps) => {
  // ── Refs: keep latest values accessible without recreating callbacks ──
  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const foodTypeRef = useRef(foodType);
  const scoreRef = useRef(score);
  const comboRef = useRef(combo);
  const powerUpTypeRef = useRef(powerUpType);
  const gameBoundsRef = useRef(gameBounds);
  const lastFoodTimeRef = useRef(lastFoodTime);
  const isPausedRef = useRef(isPaused);
  const vibrationEnabledRef = useRef(vibrationEnabled);

  // Sync refs on every render (cheap — just assignments)
  snakeRef.current = snake;
  directionRef.current = direction;
  foodRef.current = food;
  foodTypeRef.current = foodType;
  scoreRef.current = score;
  comboRef.current = combo;
  powerUpTypeRef.current = powerUpType;
  gameBoundsRef.current = gameBounds;
  lastFoodTimeRef.current = lastFoodTime;
  isPausedRef.current = isPaused;
  vibrationEnabledRef.current = vibrationEnabled;

  const vibrate = useCallback((length: number) => {
    if (!vibrationEnabledRef.current) return;
    Vibration.vibrate(length);
  }, []);

  // ── Stable moveSnake — reads refs, never recreated ──
  const moveSnake = useCallback(() => {
    const currentSnake = snakeRef.current;
    const snakeHead = currentSnake[0];
    const newHead = { ...snakeHead };
    const dir = directionRef.current;
    const bounds = gameBoundsRef.current;
    const currentFood = foodRef.current;
    const currentFoodType = foodTypeRef.current;

    switch (dir) {
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

    // Check for game over
    if (checkGameOver(newHead, bounds, currentSnake)) {
      addScore(scoreRef.current);
      setIsGameOver(true);
      vibrate(VIBRATION_PATTERNS.gameOver);
      return;
    }

    if (checkEatsFood(newHead, currentFood)) {
      // ── Handle food eaten inline (avoids another unstable callback) ──
      if (currentFoodType === FoodType.Poison) {
        vibrate(VIBRATION_PATTERNS.poison);
        setScore((prev) => Math.max(0, prev + SCORE_MULTIPLIERS.poison));

        if (currentSnake.length > 1) {
          setSnake([newHead, ...currentSnake.slice(0, -2)]);
        } else {
          setSnake([newHead]);
        }

        resetCombo(setCombo);
        setPoisonEffect(true);
        setTimeout(() => setPoisonEffect(false), 1000);
      } else {
        setSnake([newHead, ...currentSnake]);
        vibrate(VIBRATION_PATTERNS.foodEaten);
        updateCombo(comboRef.current, lastFoodTimeRef.current, setCombo, setLastFoodTime);

        let scoreIncrement = SCORE_INCREMENT;
        if (currentFoodType === FoodType.Golden) {
          scoreIncrement = SCORE_MULTIPLIERS.golden;
        } else if (currentFoodType === FoodType.Rainbow) {
          scoreIncrement = SCORE_MULTIPLIERS.rainbow;
        }

        setScore(
          (prev) => prev + calculateScore(scoreIncrement, comboRef.current, powerUpTypeRef.current)
        );
      }

      // Spawn new food & possible power-ups
      const random = Math.random();
      if (random < FOOD_PROBABILITIES.powerUp) {
        const powerUps = Object.values(PowerUp);
        activatePowerUp(powerUps[Math.floor(Math.random() * powerUps.length)]);
      } else if (random < FOOD_PROBABILITIES.special) {
        const foodTypes = Object.values(FoodType);
        setFoodType(foodTypes[Math.floor(Math.random() * foodTypes.length)]);
      } else {
        setFoodType(FoodType.Normal);
      }

      const updatedSnake =
        currentFoodType === FoodType.Poison
          ? currentSnake.length > 1
            ? [newHead, ...currentSnake.slice(0, -2)]
            : [newHead]
          : [newHead, ...currentSnake];
      setFood(randomFoodPosition(bounds.xMax, bounds.yMax, updatedSnake));
    } else {
      setSnake([newHead, ...currentSnake.slice(0, -1)]);
    }
  }, [
    // Only stable setter functions — never change identity
    addScore, setIsGameOver, setSnake, setFood, setFoodType,
    setScore, setPoisonEffect, setCombo, setLastFoodTime,
    vibrate, resetCombo, updateCombo, calculateScore, activatePowerUp,
  ]);

  // ── Ref for current speed — updated without restarting the loop ──
  const getCurrentMoveIntervalRef = useRef(getCurrentMoveInterval);
  getCurrentMoveIntervalRef.current = getCurrentMoveInterval;

  // ── The actual game loop — uses setTimeout so each tick reads latest speed ──
  useEffect(() => {
    if (isGameOver || gameBounds.xMax <= 0 || gameBounds.yMax <= 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      if (!isPausedRef.current) {
        checkPowerUpExpiration();
        moveSnake();
      }
      timeoutId = setTimeout(tick, getCurrentMoveIntervalRef.current());
    };

    timeoutId = setTimeout(tick, getCurrentMoveIntervalRef.current());
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isGameOver, gameBounds.xMax, gameBounds.yMax, moveSnake, checkPowerUpExpiration]);

  return { vibrate };
};
