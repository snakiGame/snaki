import { Coordinate } from "../types/types";

export const randomFoodPosition = (
  maxX: number,
  maxY: number,
  snake: Coordinate[] = [],
  obstacles: Coordinate[] = []
): Coordinate => {
  const PADDING = 1;
  const maxAttempts = 100;

  for (let i = 0; i < maxAttempts; i++) {
    const x = Math.floor(Math.random() * (maxX - PADDING * 2 + 1)) + PADDING;
    const y = Math.floor(Math.random() * (maxY - PADDING * 2 + 1)) + PADDING;

    const safeX = Math.min(Math.max(x, PADDING), maxX - PADDING);
    const safeY = Math.min(Math.max(y, PADDING), maxY - PADDING);

    // Ensure food doesn't spawn on the snake body
    const isOnSnake = snake.some(
      (segment) => segment.x === safeX && segment.y === safeY
    );

    // Ensure food doesn't spawn on an obstacle
    const isOnObstacle = obstacles.some(
      (obs) => obs.x === safeX && obs.y === safeY
    );

    if (!isOnSnake && !isOnObstacle) {
      return { x: safeX, y: safeY };
    }
  }

  // Fallback: find any free cell
  for (let x = PADDING; x <= maxX - PADDING; x++) {
    for (let y = PADDING; y <= maxY - PADDING; y++) {
      const isOnSnake = snake.some(
        (segment) => segment.x === x && segment.y === y
      );
      const isOnObstacle = obstacles.some(
        (obs) => obs.x === x && obs.y === y
      );
      if (!isOnSnake && !isOnObstacle) {
        return { x, y };
      }
    }
  }

  // Absolute fallback (shouldn't happen unless snake fills the board)
  return { x: PADDING, y: PADDING };
};
