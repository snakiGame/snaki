export interface GestureEventType {
  nativeEvent: { translationX: number; translationY: number };
}

export interface Coordinate {
  x: number;
  y: number;
}

export enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

export enum PowerUp {
  Speed = "SPEED",
  Slow = "SLOW",
  DoublePoints = "DOUBLE_POINTS",
}

export enum FoodType {
  Normal = "NORMAL",
  Golden = "GOLDEN",
  Rainbow = "RAINBOW",
  Poison = "POISON",
}

export interface ScoreProps {
  score: number;
  combo: number;
  onHighScorePress: () => void;
  highScore?: number;
  difficulty?: number;
}

export interface GameoverModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  reloadGame: () => void;
  score: number;
  highScore: number;
}
