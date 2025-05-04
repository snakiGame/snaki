import { Coordinate } from "../types/types";

export const randomFoodPosition = (maxX: number, maxY: number): Coordinate => {
  
  const PADDING = 2;
  const x = Math.floor(Math.random() * (maxX - (PADDING * 2))) + PADDING;
  const y = Math.floor(Math.random() * (maxY - (PADDING * 2))) + PADDING;
  
  const safeX = Math.min(Math.max(x, PADDING), maxX - PADDING);
  const safeY = Math.min(Math.max(y, PADDING), maxY - PADDING);
  
  return { x: safeX, y: safeY };
};
