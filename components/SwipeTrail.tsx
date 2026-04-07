import React, { useRef, useCallback } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Colors } from "../styles/colors";

interface TrailDot {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
}

const MAX_DOTS = 8;
const DOT_SIZE = 6;
const FADE_DURATION = 400;

export const useSwipeTrail = () => {
  const dotsRef = useRef<TrailDot[]>([]);
  const idRef = useRef(0);
  const [, forceUpdate] = React.useState(0);

  const addDot = useCallback((x: number, y: number) => {
    const opacity = new Animated.Value(0.15);
    const dot: TrailDot = { id: idRef.current++, x, y, opacity };
    dotsRef.current = [...dotsRef.current.slice(-(MAX_DOTS - 1)), dot];
    forceUpdate((n) => n + 1);

    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      dotsRef.current = dotsRef.current.filter((d) => d.id !== dot.id);
      forceUpdate((n) => n + 1);
    });
  }, []);

  const dots = dotsRef.current;

  const TrailLayer = useCallback(
    () => (
      <View style={styles.container} pointerEvents="none">
        {dots.map((dot) => (
          <Animated.View
            key={dot.id}
            style={[
              styles.dot,
              {
                left: dot.x - DOT_SIZE / 2,
                top: dot.y - DOT_SIZE / 2,
                opacity: dot.opacity,
              },
            ]}
          />
        ))}
      </View>
    ),
    [dots],
  );

  return { addDot, TrailLayer };
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.primary,
  },
});
