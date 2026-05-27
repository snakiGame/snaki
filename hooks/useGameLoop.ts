import { useEffect, useCallback, useRef } from "react";
import { Vibration } from "react-native";
import { Direction, Coordinate, FoodType, PowerUp } from "../types/types";
import { GameBounds, SPECIAL_FOOD_MIN_DISTANCE } from "../lib/gameConstants";
import { checkEatsFood } from "../utils/checkEatsFood";
import { checkGameOver } from "../utils/checkGameOver";
import { randomFoodPosition } from "../utils/randomFoodPosition";
import {
  SCORE_INCREMENT,
  SCORE_MULTIPLIERS,
  FOOD_PROBABILITIES,
  VIBRATION_PATTERNS,
  COMBO_THRESHOLD,
  OBSTACLE_THRESHOLDS,
} from "../lib/gameConstants";

interface UseGameLoopProps {
  snake: Coordinate[];
  direction: Direction;
  queuedDirection: Direction | null;
  food: Coordinate;
  foodType: FoodType;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  combo: number;
  powerUpType: PowerUp | null;
  gameBounds: GameBounds;
  vibrationEnabled: boolean;
  obstacles: Coordinate[];

  // State setters
  setSnake: (snake: Coordinate[]) => void;
  setDirection: (direction: Direction) => void;
  setQueuedDirection: (direction: Direction | null) => void;
  setFood: (food: Coordinate) => void;
  setFoodType: (type: FoodType) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setIsGameOver: (gameOver: boolean) => void;
  setPoisonEffect: (effect: boolean) => void;
  setObstacles: (
    obstacles: Coordinate[] | ((prev: Coordinate[]) => Coordinate[]),
  ) => void;

  // Actions
  getCurrentMoveInterval: () => number;
  updateCombo: (
    combo: number,
    lastFoodTime: number,
    setCombo: (combo: number) => void,
    setLastFoodTime: (time: number) => void,
  ) => void;
  resetCombo: (setCombo: (combo: number) => void) => void;
  calculateScore: (
    baseScore: number,
    combo: number,
    powerUpType: PowerUp | null,
  ) => number;
  activatePowerUp: (type: PowerUp) => void;
  checkPowerUpExpiration: () => void;
  addScore: (score: number) => void;
  setCombo: (combo: number) => void;
  setLastFoodTime: (time: number) => void;
  lastFoodTime: number;
}

const isOppositeDirection = (a: Direction, b: Direction) => {
  return (
    (a === Direction.Up && b === Direction.Down) ||
    (a === Direction.Down && b === Direction.Up) ||
    (a === Direction.Left && b === Direction.Right) ||
    (a === Direction.Right && b === Direction.Left)
  );
};

const pickNextFoodType = (currentScore: number): FoodType => {
  const poisonChance =
    currentScore < 30 ? 0.04 : currentScore < 80 ? 0.08 : 0.12;
  const rainbowChance = currentScore < 50 ? 0.06 : 0.08;
  const goldenChance = 0.16;

  const roll = Math.random();
  if (roll < poisonChance) return FoodType.Poison;
  if (roll < poisonChance + rainbowChance) return FoodType.Rainbow;
  if (roll < poisonChance + rainbowChance + goldenChance)
    return FoodType.Golden;
  return FoodType.Normal;
};

export const useGameLoop = ({
  snake,
  direction,
  queuedDirection,
  food,
  foodType,
  score,
  isGameOver,
  isPaused,
  combo,
  powerUpType,
  gameBounds,
  vibrationEnabled,
  obstacles,
  setSnake,
  setDirection,
  setQueuedDirection,
  setFood,
  setFoodType,
  setScore,
  setIsGameOver,
  setPoisonEffect,
  setObstacles,
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
  const queuedDirectionRef = useRef(queuedDirection);
  const foodRef = useRef(food);
  const foodTypeRef = useRef(foodType);
  const scoreRef = useRef(score);
  const comboRef = useRef(combo);
  const powerUpTypeRef = useRef(powerUpType);
  const gameBoundsRef = useRef(gameBounds);
  const lastFoodTimeRef = useRef(lastFoodTime);
  const isPausedRef = useRef(isPaused);
  const vibrationEnabledRef = useRef(vibrationEnabled);
  const obstaclesRef = useRef(obstacles);

  // Sync refs on every render (cheap — just assignments)
  snakeRef.current = snake;
  directionRef.current = direction;
  queuedDirectionRef.current = queuedDirection;
  foodRef.current = food;
  foodTypeRef.current = foodType;
  scoreRef.current = score;
  comboRef.current = combo;
  powerUpTypeRef.current = powerUpType;
  gameBoundsRef.current = gameBounds;
  lastFoodTimeRef.current = lastFoodTime;
  isPausedRef.current = isPaused;
  vibrationEnabledRef.current = vibrationEnabled;
  obstaclesRef.current = obstacles;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!vibrationEnabledRef.current) return;
    Vibration.vibrate(pattern);
  }, []);

  // ── Stable moveSnake — reads refs, never recreated ──
  const moveSnake = useCallback(() => {
    const currentSnake = snakeRef.current;
    const snakeHead = currentSnake[0];
    const newHead = { ...snakeHead };
    const bounds = gameBoundsRef.current;
    const currentFood = foodRef.current;
    const currentFoodType = foodTypeRef.current;

    // Consume one buffered turn on each tick
    let effectiveDirection = directionRef.current;
    const buffered = queuedDirectionRef.current;
    if (buffered) {
      if (!isOppositeDirection(effectiveDirection, buffered)) {
        effectiveDirection = buffered;
        setDirection(buffered);
      }
      setQueuedDirection(null);
    }

    switch (effectiveDirection) {
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
    if (checkGameOver(newHead, bounds, currentSnake, obstaclesRef.current)) {
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
        updateCombo(
          comboRef.current,
          lastFoodTimeRef.current,
          setCombo,
          setLastFoodTime,
        );

        // Combo-specific haptics
        const nextCombo =
          Date.now() - lastFoodTimeRef.current < 2000
            ? comboRef.current + 1
            : 1;
        if (nextCombo >= 5) {
          vibrate(VIBRATION_PATTERNS.combo5);
        } else if (nextCombo >= 4) {
          vibrate(VIBRATION_PATTERNS.combo4);
        } else if (nextCombo >= COMBO_THRESHOLD) {
          vibrate(VIBRATION_PATTERNS.combo3);
        } else {
          vibrate(VIBRATION_PATTERNS.foodEaten);
        }

        let scoreIncrement = SCORE_INCREMENT;
        if (currentFoodType === FoodType.Golden) {
          scoreIncrement = SCORE_MULTIPLIERS.golden;
        } else if (currentFoodType === FoodType.Rainbow) {
          scoreIncrement = SCORE_MULTIPLIERS.rainbow;
        }

        setScore(
          (prev) =>
            prev +
            calculateScore(
              scoreIncrement,
              comboRef.current,
              powerUpTypeRef.current,
            ),
        );
      }

      // Spawn possible power-up
      if (Math.random() < FOOD_PROBABILITIES.powerUp) {
        const powerUps = Object.values(PowerUp);
        activatePowerUp(powerUps[Math.floor(Math.random() * powerUps.length)]);
      }

      const updatedSnake =
        currentFoodType === FoodType.Poison
          ? currentSnake.length > 1
            ? [newHead, ...currentSnake.slice(0, -2)]
            : [newHead]
          : [newHead, ...currentSnake];

      const nextFoodType = pickNextFoodType(scoreRef.current);
      const minDistanceFromHead =
        nextFoodType === FoodType.Poison
          ? SPECIAL_FOOD_MIN_DISTANCE.poison
          : nextFoodType === FoodType.Rainbow
            ? SPECIAL_FOOD_MIN_DISTANCE.rainbow
            : nextFoodType === FoodType.Golden
              ? SPECIAL_FOOD_MIN_DISTANCE.golden
              : SPECIAL_FOOD_MIN_DISTANCE.normal;

      setFoodType(nextFoodType);
      setFood(
        randomFoodPosition(
          bounds.xMax,
          bounds.yMax,
          updatedSnake,
          obstaclesRef.current,
          updatedSnake[0],
          minDistanceFromHead,
        ),
      );
    } else {
      setSnake([newHead, ...currentSnake.slice(0, -1)]);
    }
  }, [
    addScore,
    setIsGameOver,
    setSnake,
    setDirection,
    setQueuedDirection,
    setFood,
    setFoodType,
    setScore,
    setPoisonEffect,
    setCombo,
    setLastFoodTime,
    vibrate,
    resetCombo,
    updateCombo,
    calculateScore,
    activatePowerUp,
  ]);

  // ── Ref for current speed — updated without restarting the loop ──
  const getCurrentMoveIntervalRef = useRef(getCurrentMoveInterval);
  getCurrentMoveIntervalRef.current = getCurrentMoveInterval;

  // ── Spawn obstacles when score crosses thresholds ──
  const spawnedThresholdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (isGameOver) return;

    for (const threshold of OBSTACLE_THRESHOLDS) {
      if (
        score >= threshold.score &&
        !spawnedThresholdsRef.current.has(threshold.score)
      ) {
        spawnedThresholdsRef.current.add(threshold.score);

        // Generate new obstacle positions
        const currentSnake = snakeRef.current;
        const currentFood = foodRef.current;
        const bounds = gameBoundsRef.current;
        const currentObstacles = obstaclesRef.current;
        const PADDING = 2; // Keep obstacles away from edges

        const newObstacles: Coordinate[] = [];
        let attempts = 0;
        while (newObstacles.length < threshold.count && attempts < 200) {
          attempts++;
          const x =
            Math.floor(Math.random() * (bounds.xMax - PADDING * 2 + 1)) +
            PADDING;
          const y =
            Math.floor(Math.random() * (bounds.yMax - PADDING * 2 + 1)) +
            PADDING;

          // Don't place on snake
          const onSnake = currentSnake.some((s) => s.x === x && s.y === y);
          // Don't place on food
          const onFood = currentFood.x === x && currentFood.y === y;
          // Don't place on existing obstacles
          const onExisting = currentObstacles.some(
            (o) => o.x === x && o.y === y,
          );
          // Don't place on already-chosen new obstacles
          const onNew = newObstacles.some((o) => o.x === x && o.y === y);
          // Don't place adjacent to snake head (give player breathing room)
          const head = currentSnake[0];
          const tooCloseToHead =
            Math.abs(x - head.x) <= 2 && Math.abs(y - head.y) <= 2;

          if (!onSnake && !onFood && !onExisting && !onNew && !tooCloseToHead) {
            newObstacles.push({ x, y });
          }
        }

        if (newObstacles.length > 0) {
          setObstacles((prev: Coordinate[]) => [...prev, ...newObstacles]);
        }
      }
    }
  }, [score, isGameOver, setObstacles]);

  // Reset spawned thresholds when game resets
  useEffect(() => {
    if (!isGameOver && score === 0) {
      spawnedThresholdsRef.current.clear();
    }
  }, [isGameOver, score]);

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
  }, [
    isGameOver,
    gameBounds.xMax,
    gameBounds.yMax,
    moveSnake,
    checkPowerUpExpiration,
  ]);

  return { vibrate };
};
