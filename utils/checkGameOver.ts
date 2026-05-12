import { Coordinate } from "../types/types";

interface GameBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const checkGameOver = (
  snakeHead: Coordinate,
  boundaries: GameBounds,
  snakeBody: Coordinate[] = [],
  obstacles: Coordinate[] = []
): boolean => {
  // Check if snake is out of bounds
  const outOfBounds = (
    snakeHead.x < boundaries.xMin ||
    snakeHead.x > boundaries.xMax ||
    snakeHead.y < boundaries.yMin ||
    snakeHead.y > boundaries.yMax
  );

  // Check if snake collides with itself
  const selfCollision = snakeBody.some((segment, index) => {
    // Skip the head (index 0) since we're comparing with it
    return index > 0 && segment.x === snakeHead.x && segment.y === snakeHead.y;
  });

  // Check if snake collides with an obstacle
  const obstacleCollision = obstacles.some(
    (obs) => obs.x === snakeHead.x && obs.y === snakeHead.y
  );

  return outOfBounds || selfCollision || obstacleCollision;
};
