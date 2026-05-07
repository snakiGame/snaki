import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { Coordinate, FoodType } from "../types/types";
import { Colors } from "../styles/colors";
import { GAME_UNIT_SIZE } from "../lib/gameConstants";

interface FoodProps extends Coordinate {
  type: FoodType;
}

const Food: React.FC<FoodProps> = React.memo(
  ({ x, y, type }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.3)).current;
    const isSpecial = type === FoodType.Golden || type === FoodType.Rainbow;

    useEffect(() => {
      if (!isSpecial) {
        pulseAnim.setValue(1);
        glowAnim.setValue(0);
        return;
      }
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.7,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      glow.start();
      return () => {
        pulse.stop();
        glow.stop();
      };
    }, [isSpecial]);

    const getFoodColor = () => {
      switch (type) {
        case FoodType.Golden:
          return Colors.accent;
        case FoodType.Rainbow:
          return "#c084fc"; // Purple
        case FoodType.Poison:
          return Colors.danger;
        default:
          return Colors.accent;
      }
    };

    const getShadowColor = () => {
      switch (type) {
        case FoodType.Golden:
          return Colors.accentDark;
        case FoodType.Rainbow:
          return "#7c3aed";
        case FoodType.Poison:
          return Colors.dangerDark;
        default:
          return Colors.accentDark;
      }
    };

    const size = GAME_UNIT_SIZE - 2;
    const offset = (GAME_UNIT_SIZE - size) / 2;

    return (
      <Animated.View
        style={[
          styles.food,
          {
            left: x * GAME_UNIT_SIZE + offset,
            top: y * GAME_UNIT_SIZE + offset,
            width: size,
            height: size,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {/* Glow ring for special food */}
        {isSpecial && (
          <Animated.View
            style={[
              styles.glowRing,
              {
                backgroundColor: getFoodColor(),
                opacity: glowAnim,
                width: size + 8,
                height: size + 8,
                left: -4,
                top: -4,
              },
            ]}
          />
        )}
        {/* Shadow block */}
        <View
          style={[styles.foodShadow, { backgroundColor: getShadowColor() }]}
        />
        {/* Main block */}
        <View
          style={[
            styles.foodBlock,
            { backgroundColor: getFoodColor(), width: size, height: size },
          ]}
        />
      </Animated.View>
    );
  },
  (prev, next) =>
    prev.x === next.x && prev.y === next.y && prev.type === next.type,
);

const styles = StyleSheet.create({
  food: {
    position: "absolute",
  },
  foodBlock: {
    borderRadius: 3,
    zIndex: 2,
  },
  foodShadow: {
    position: "absolute",
    left: 1,
    top: 2,
    right: -1,
    bottom: -2,
    borderRadius: 3,
    zIndex: 1,
  },
  glowRing: {
    position: "absolute",
    borderRadius: 6,
    zIndex: 0,
  },
});

export default Food;
