import { Coordinate, Direction, FoodType } from "../types/types";

// Game configuration constants
export const SNAKE_INITIAL_POSITION: Coordinate[] = [{ x: 5, y: 5 }];
export const FOOD_INITIAL_POSITION: Coordinate = { x: 5, y: 20 };
export const BASE_MOVE_INTERVAL = 55; // Base speed in milliseconds
export const SCORE_INCREMENT = 1;
export const BORDER_WIDTH = 12;
export const GAME_UNIT_SIZE = 10;
export const COMBO_THRESHOLD = 3;
export const COMBO_TIMEOUT = 2000; // 2 seconds
export const POWER_UP_DURATION = 5000; // 5 seconds

// Difficulty progression
export const DIFFICULTY_LEVELS = [
  { score: 0, interval: 55 },    // Level 1: Normal speed
  { score: 20, interval: 45 },   // Level 2: Faster
  { score: 50, interval: 35 },   // Level 3: Even faster
  { score: 100, interval: 25 },  // Level 4: Very fast
];

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

// Food spawn probabilities
export const FOOD_PROBABILITIES = {
  powerUp: 0.1,   // 10% chance for power-up
  special: 0.3,   // 30% chance for special food (includes power-up chance)
};

// Vibration patterns
export const VIBRATION_PATTERNS = {
  foodEaten: 25,
  poison: 100,
  gameOver: 300,
};