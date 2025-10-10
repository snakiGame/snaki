import React from "react";
import { View, StyleSheet } from "react-native";

interface PoisonOverlayProps {
  isVisible: boolean;
}

const PoisonOverlay: React.FC<PoisonOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return <View style={styles.poisonOverlay} />;
};

const styles = StyleSheet.create({
  poisonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    zIndex: 1,
  },
});

export default PoisonOverlay;
