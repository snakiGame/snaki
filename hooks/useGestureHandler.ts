import { useCallback } from "react";
import { Direction, GestureEventType } from "../types/types";

export const useGestureHandler = () => {
  const handleGesture = useCallback(
    (
      event: GestureEventType,
      currentDirection: Direction,
      setDirection: (direction: Direction) => void
    ) => {
      const { translationX, translationY } = event.nativeEvent;

      // Prevent reversing direction (e.g., going right then immediately left)
      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > 0 && currentDirection !== Direction.Left) {
          setDirection(Direction.Right);
        } else if (translationX < 0 && currentDirection !== Direction.Right) {
          setDirection(Direction.Left);
        }
      } else {
        if (translationY > 0 && currentDirection !== Direction.Up) {
          setDirection(Direction.Down);
        } else if (translationY < 0 && currentDirection !== Direction.Down) {
          setDirection(Direction.Up);
        }
      }
    },
    []
  );

  return { handleGesture };
};
