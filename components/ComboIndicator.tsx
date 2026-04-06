import React from "react";
import { Animated, StyleSheet } from "react-native";
import { Colors, BLOCK_RADIUS } from "../styles/colors";
import { COMBO_THRESHOLD } from "../lib/gameConstants";

interface ComboIndicatorProps {
  combo: number;
  comboAnimation: Animated.Value;
}

const ComboIndicator: React.FC<ComboIndicatorProps> = ({
  combo,
  comboAnimation,
}) => {
  if (combo < COMBO_THRESHOLD) return null;

  return (
    <Animated.View
      style={[
        styles.comboBlock,
        {
          transform: [
            {
              scale: comboAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.3],
              }),
            },
          ],
        },
      ]}
    >
      <Animated.Text style={styles.comboText}>{combo}x COMBO!</Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  comboBlock: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: BLOCK_RADIUS,
    zIndex: 10,
  },
  comboText: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 2,
  },
});

export default ComboIndicator;
