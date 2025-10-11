import { useState, useCallback } from "react";
import { Animated } from "react-native";
import { PowerUp } from "../types/types";
import {
  COMBO_THRESHOLD,
  COMBO_TIMEOUT,
  SCORE_MULTIPLIERS,
} from "../lib/gameConstants";

export const useComboSystem = () => {
  const [comboAnimation] = useState(new Animated.Value(0));

  // Handle combo system
  const updateCombo = useCallback(
    (
      combo: number,
      lastFoodTime: number,
      setCombo: (combo: number) => void,
      setLastFoodTime: (time: number) => void
    ) => {
      const now = Date.now();
      if (now - lastFoodTime < COMBO_TIMEOUT) {
        setCombo(combo + 1);
        const newCombo = combo + 1;

        if (newCombo >= COMBO_THRESHOLD) {
          // Trigger combo animation
          Animated.sequence([
            Animated.timing(comboAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(comboAnimation, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      } else {
        setCombo(1);
      }
      setLastFoodTime(now);
    },
    [comboAnimation]
  );

  const resetCombo = useCallback((setCombo: (combo: number) => void) => {
    setCombo(0);
  }, []);

  // Calculate score with combo and power-up multipliers
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
    []
  );

  return {
    comboAnimation,
    updateCombo,
    resetCombo,
    calculateScore,
  };
};
