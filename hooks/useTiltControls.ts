import { useEffect, useRef, useCallback } from "react";
import { Accelerometer } from "expo-sensors";
import { Direction } from "@/types/types";

const TILT_THRESHOLD = 0.35; // Tilt angle before registering a direction change
const COOLDOWN_MS = 150; // Prevent rapid direction flipping

interface UseTiltControlsOptions {
  enabled: boolean;
  currentDirection: Direction;
  queuedDirection: Direction | null;
  setQueuedDirection: (direction: Direction | null) => void;
  isPaused: boolean;
  isGameOver: boolean;
}

const isOppositeDirection = (a: Direction, b: Direction) => {
  return (
    (a === Direction.Up && b === Direction.Down) ||
    (a === Direction.Down && b === Direction.Up) ||
    (a === Direction.Left && b === Direction.Right) ||
    (a === Direction.Right && b === Direction.Left)
  );
};

export function useTiltControls({
  enabled,
  currentDirection,
  queuedDirection,
  setQueuedDirection,
  isPaused,
  isGameOver,
}: UseTiltControlsOptions) {
  const lastTiltTime = useRef(0);
  const subscriptionRef = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);

  // Store latest values in refs so the accelerometer listener doesn't
  // need to re-subscribe when direction/queue changes
  const dirRef = useRef(currentDirection);
  const queueRef = useRef(queuedDirection);
  const pausedRef = useRef(isPaused);
  const gameOverRef = useRef(isGameOver);

  dirRef.current = currentDirection;
  queueRef.current = queuedDirection;
  pausedRef.current = isPaused;
  gameOverRef.current = isGameOver;

  useEffect(() => {
    if (!enabled) {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      return;
    }

    Accelerometer.setUpdateInterval(80); // ~12 readings/sec

    subscriptionRef.current = Accelerometer.addListener(({ x, y }) => {
      if (pausedRef.current || gameOverRef.current) return;
      if (queueRef.current) return; // Already have a queued turn

      const now = Date.now();
      if (now - lastTiltTime.current < COOLDOWN_MS) return;

      // x = left/right tilt, y = forward/back tilt
      // In portrait mode: x positive = tilt right, y positive = tilt forward (up)
      const absX = Math.abs(x);
      const absY = Math.abs(y);

      // Only register if tilt exceeds threshold
      if (absX < TILT_THRESHOLD && absY < TILT_THRESHOLD) return;

      let nextDirection: Direction;
      if (absX > absY) {
        // Horizontal tilt dominates
        nextDirection = x > 0 ? Direction.Right : Direction.Left;
      } else {
        // Vertical tilt dominates
        // y negative = tilt toward you = down on screen
        nextDirection = y > 0 ? Direction.Up : Direction.Down;
      }

      if (nextDirection === dirRef.current) return;
      if (isOppositeDirection(dirRef.current, nextDirection)) return;

      lastTiltTime.current = now;
      setQueuedDirection(nextDirection);
    });

    return () => {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    };
  }, [enabled, setQueuedDirection]);
}
