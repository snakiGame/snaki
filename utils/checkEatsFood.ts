import { Coordinate } from "../types/types";

export const checkEatsFood = (
  head: Coordinate,
  food: Coordinate,
): boolean => {
  return head.x === food.x && head.y === food.y;
};
