import { useState, useCallback, useRef } from "react";
import { Animated } from "react-native";
import { PowerUp } from "../types/types";
import {
  COMBO_THRESHOLD,
  COMBO_TIMEOUT,
  SCORE_MULTIPLIERS,
} from "../lib/gameConstants";

export const useComboSystem = () => {
  const [comboAnimation] = useState(new Animated.Value(0));
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const updateCombo = useCallback(
    (
      combo: number,
      lastFoodTime: number,
      setCombo: (combo: number) => void,
      setLastFoodTime: (time: number) => void,
    ) => {
      const now = Date.now();
      const newCombo = now - lastFoodTime < COMBO_TIMEOUT ? combo + 1 : 1;
      setCombo(newCombo);
      setLastFoodTime(now);

      if (newCombo >= COMBO_THRESHOLD) {
        // Stop any running animation before starting a new one
        animationRef.current?.stop();
        animationRef.current = Animated.sequence([
          Animated.timing(comboAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(comboAnimation, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]);
        animationRef.current.start();
      }
    },
    [comboAnimation],
  );

  const resetCombo = useCallback(
    (setCombo: (combo: number) => void) => {
      setCombo(0);
      animationRef.current?.stop();
      comboAnimation.setValue(0);
    },
    [comboAnimation],
  );

  const calculateScore = useCallback(
    (baseScore: number, combo: number, powerUpType: PowerUp | null) => {
      let finalScore = baseScore;

      if (combo >= COMBO_THRESHOLD) {
        finalScore *= Math.min(combo, SCORE_MULTIPLIERS.maxCombo);
      }

      if (powerUpType === PowerUp.DoublePoints) {
        finalScore *= SCORE_MULTIPLIERS.doublePoints;
      }

      return finalScore;
    },
    [],
  );

  return {
    comboAnimation,
    updateCombo,
    resetCombo,
    calculateScore,
  };
};
