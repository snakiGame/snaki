import { useCallback } from "react";
import { Direction, GestureEventType } from "../types/types";

const MIN_SWIPE_DISTANCE = 10; // Minimum pixels before registering a swipe

export const useGestureHandler = () => {
  const handleGesture = useCallback(
    (
      event: GestureEventType,
      currentDirection: Direction,
      setDirection: (direction: Direction) => void
    ) => {
      const { translationX, translationY } = event.nativeEvent;

      // Ignore tiny accidental touches
      if (
        Math.abs(translationX) < MIN_SWIPE_DISTANCE &&
        Math.abs(translationY) < MIN_SWIPE_DISTANCE
      ) {
        return;
      }

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
