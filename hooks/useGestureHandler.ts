import { useCallback } from "react";
import { Direction, GestureEventType } from "../types/types";

const MIN_SWIPE_DISTANCE = 10; // Minimum pixels before registering a swipe

const isOppositeDirection = (a: Direction, b: Direction) => {
  return (
    (a === Direction.Up && b === Direction.Down) ||
    (a === Direction.Down && b === Direction.Up) ||
    (a === Direction.Left && b === Direction.Right) ||
    (a === Direction.Right && b === Direction.Left)
  );
};

export const useGestureHandler = () => {
  const handleGesture = useCallback(
    (
      event: GestureEventType,
      currentDirection: Direction,
      queuedDirection: Direction | null,
      setQueuedDirection: (direction: Direction | null) => void,
    ) => {
      const { translationX, translationY } = event.nativeEvent;

      // Ignore tiny accidental touches
      if (
        Math.abs(translationX) < MIN_SWIPE_DISTANCE &&
        Math.abs(translationY) < MIN_SWIPE_DISTANCE
      ) {
        return;
      }

      // 1-turn buffering: if we already queued a turn for the next tick,
      // keep it and ignore additional swipes until it is consumed.
      if (queuedDirection) return;

      let nextDirection: Direction;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        nextDirection = translationX > 0 ? Direction.Right : Direction.Left;
      } else {
        nextDirection = translationY > 0 ? Direction.Down : Direction.Up;
      }

      if (nextDirection === currentDirection) return;
      if (isOppositeDirection(currentDirection, nextDirection)) return;

      setQueuedDirection(nextDirection);
    },
    [],
  );

  return { handleGesture };
};
