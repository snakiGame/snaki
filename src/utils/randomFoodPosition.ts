import { Coordinate } from "../types/types";

export const randomFoodPosition = (maxX: number, maxY: number): Coordinate => {
  return {
    x: Math.floor(Math.random() * (maxX - 1)),
    y: Math.floor(Math.random() * (maxY - 1)),
  };
};
