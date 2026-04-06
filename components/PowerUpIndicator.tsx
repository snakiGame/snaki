import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PowerUp } from "../types/types";
import { Colors, BLOCK_RADIUS } from "../styles/colors";

interface PowerUpIndicatorProps {
  type: PowerUp;
  timeLeft: number;
}

const PowerUpIndicator: React.FC<PowerUpIndicatorProps> = ({
  type,
  timeLeft,
}) => {
  const getPowerUpColor = () => {
    switch (type) {
      case PowerUp.Speed:
        return Colors.primary;
      case PowerUp.Slow:
        return "#60a5fa"; // Blue
      case PowerUp.DoublePoints:
        return Colors.accent;
      default:
        return Colors.primary;
    }
  };

  const getLabel = () => {
    switch (type) {
      case PowerUp.Speed:
        return "FAST";
      case PowerUp.Slow:
        return "SLOW";
      case PowerUp.DoublePoints:
        return "2X";
      default:
        return type;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getPowerUpColor() }]}>
      <Text style={styles.text}>{getLabel()}</Text>
      <Text style={styles.timeLeft}>{Math.ceil(timeLeft / 1000)}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BLOCK_RADIUS - 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 10,
  },
  text: {
    color: Colors.background,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1,
  },
  timeLeft: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: "700",
  },
});

export default PowerUpIndicator;
