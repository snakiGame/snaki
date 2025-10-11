import React from "react";
import { Animated, StyleSheet } from "react-native";
import { Colors } from "../styles/colors";
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
    <Animated.Text
      style={[
        styles.comboText,
        {
          transform: [
            {
              scale: comboAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.5],
              }),
            },
          ],
        },
      ]}
    >
      {combo}x COMBO!
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  comboText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

export default ComboIndicator;
