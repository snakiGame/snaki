import {
  Coordinate,
  Direction,
  FoodType,
  DifficultyMode,
} from "../types/types";

// Game configuration constants
export const SNAKE_INITIAL_POSITION: Coordinate[] = [{ x: 5, y: 5 }];
export const FOOD_INITIAL_POSITION: Coordinate = { x: 5, y: 20 };

// Base speed in milliseconds for NORMAL mode level 1
export const BASE_MOVE_INTERVAL = 110;
export const SCORE_INCREMENT = 1;
export const BORDER_WIDTH = 12;
export const GAME_UNIT_SIZE = 18;
export const COMBO_THRESHOLD = 3;
export const COMBO_TIMEOUT = 2000; // 2 seconds
export const POWER_UP_DURATION = 5000; // 5 seconds

export interface DifficultyLevel {
  score: number;
  interval: number;
}

// Difficulty progression per mode (higher interval = slower movement)
export const DIFFICULTY_CURVES: Record<DifficultyMode, DifficultyLevel[]> = {
  casual: [
    { score: 0, interval: 130 },
    { score: 20, interval: 118 },
    { score: 50, interval: 106 },
    { score: 100, interval: 95 },
    { score: 160, interval: 86 },
  ],
  normal: [
    { score: 0, interval: 110 },
    { score: 20, interval: 96 },
    { score: 50, interval: 84 },
    { score: 100, interval: 72 },
    { score: 160, interval: 64 },
  ],
  hardcore: [
    { score: 0, interval: 95 },
    { score: 20, interval: 82 },
    { score: 50, interval: 70 },
    { score: 100, interval: 58 },
    { score: 160, interval: 48 },
  ],
};

// Backward-compatible alias (normal curve)
export const DIFFICULTY_LEVELS = DIFFICULTY_CURVES.normal;

// Initial game state
export const INITIAL_GAME_STATE = {
  snake: SNAKE_INITIAL_POSITION,
  food: FOOD_INITIAL_POSITION,
  foodType: FoodType.Normal,
  direction: Direction.Right,
  score: 0,
  combo: 0,
  isGameOver: false,
  isPaused: false,
  speedMultiplier: 1,
  currentDifficulty: 1,
  poisonEffect: false,
};

// Game bounds interface
export interface GameBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

// Power-up state interface
export interface PowerUpState {
  type: import("../types/types").PowerUp | null;
  endTime: number;
}

// Score calculation helpers
export const SCORE_MULTIPLIERS = {
  normal: 1,
  golden: 3,
  rainbow: 5,
  poison: -5, // Negative score for poison
  doublePoints: 2,
  maxCombo: 5,
};

// Food + power-up spawn helpers
export const FOOD_PROBABILITIES = {
  powerUp: 0.1, // 10% chance for power-up roll
};

// Keep special food away from snake head for fairness
export const SPECIAL_FOOD_MIN_DISTANCE = {
  normal: 0,
  golden: 3,
  rainbow: 4,
  poison: 5,
};

// Dynamic obstacle thresholds — score → number of new obstacles to add
export const OBSTACLE_THRESHOLDS = [
  { score: 15, count: 2 },
  { score: 30, count: 2 },
  { score: 50, count: 3 },
  { score: 80, count: 3 },
  { score: 120, count: 4 },
  { score: 170, count: 4 },
];

// Vibration patterns
export const VIBRATION_PATTERNS = {
  foodEaten: 25,
  poison: 100,
  gameOver: 300,
  combo3: [0, 30, 30, 30] as number[],
  combo4: [0, 25, 25, 25, 25, 25] as number[],
  combo5: [0, 20, 20, 20, 20, 20, 20, 20] as number[],
};
