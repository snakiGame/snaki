import React, { useRef, useCallback, useImperativeHandle, forwardRef } from "react";
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
const FADE_DURATION = 350;

export interface SwipeTrailHandle {
  addDot: (x: number, y: number) => void;
}

const SwipeTrail = forwardRef<SwipeTrailHandle>((_, ref) => {
  const dotsRef = useRef<TrailDot[]>([]);
  const idRef = useRef(0);
  const [, bump] = React.useState(0);

  const addDot = useCallback((x: number, y: number) => {
    const opacity = new Animated.Value(0.15);
    const dot: TrailDot = { id: idRef.current++, x, y, opacity };
    dotsRef.current = [...dotsRef.current.slice(-(MAX_DOTS - 1)), dot];
    bump((n) => n + 1);

    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      dotsRef.current = dotsRef.current.filter((d) => d.id !== dot.id);
      bump((n) => n + 1);
    });
  }, []);

  useImperativeHandle(ref, () => ({ addDot }), [addDot]);

  return (
    <View style={styles.container} pointerEvents="none">
      {dotsRef.current.map((dot) => (
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
  );
});

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

export default SwipeTrail;
