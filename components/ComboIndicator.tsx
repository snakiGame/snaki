import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "../styles/colors";
import { COMBO_THRESHOLD, SCORE_MULTIPLIERS } from "../lib/gameConstants";

interface ComboIndicatorProps {
  combo: number;
  comboAnimation: Animated.Value;
}

const ComboIndicator: React.FC<ComboIndicatorProps> = React.memo(
  ({ combo, comboAnimation }) => {
    const slideAnim = useRef(new Animated.Value(-80)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const wasVisibleRef = useRef(false);

    useEffect(() => {
      const isVisible = combo >= COMBO_THRESHOLD;

      if (isVisible && !wasVisibleRef.current) {
        // First time crossing threshold — slide in
        slideAnim.setValue(-80);
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 200,
          friction: 12,
          useNativeDriver: true,
        }).start();
      } else if (isVisible && wasVisibleRef.current) {
        // Already visible — just shake on increment
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 6,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -6,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 4,
            duration: 35,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -4,
            duration: 35,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 30,
            useNativeDriver: true,
          }),
        ]).start();
      }

      wasVisibleRef.current = isVisible;
    }, [combo, slideAnim, shakeAnim]);

    if (combo < COMBO_THRESHOLD) return null;

    // Cap displayed multiplier to match score calculation
    const displayCombo = Math.min(combo, SCORE_MULTIPLIERS.maxCombo);

    // Intensity tiers for color punch
    const isHot = combo >= 8;
    const isFire = combo >= 12;
    const bgColor = isFire ? Colors.danger : isHot ? "#ff8c00" : Colors.accent;
    const shadowColor = isFire
      ? Colors.dangerDark
      : isHot
        ? "#cc6600"
        : Colors.accentDark;

    return (
      <Animated.View
        style={[
          styles.wrapper,
          {
            transform: [
              { translateY: slideAnim },
              { translateX: shakeAnim },
              {
                scale: comboAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                }),
              },
            ],
          },
        ]}
      >
        {/* Block shadow */}
        <View style={[styles.shadow, { backgroundColor: shadowColor }]} />
        {/* Main block */}
        <View style={[styles.block, { backgroundColor: bgColor }]}>
          <Animated.Text style={styles.multiplier}>
            {displayCombo}x
          </Animated.Text>
          <Animated.Text style={styles.label}>COMBO</Animated.Text>
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    zIndex: 10,
  },
  shadow: {
    position: "absolute",
    top: BLOCK_SHADOW_OFFSET,
    left: 2,
    right: -2,
    bottom: -BLOCK_SHADOW_OFFSET,
    borderRadius: BLOCK_RADIUS,
  },
  block: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: BLOCK_RADIUS,
    gap: 6,
  },
  multiplier: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 3,
    opacity: 0.7,
  },
});

export default ComboIndicator;
