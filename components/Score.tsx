import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScoreProps } from "../types/types";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "../styles/colors";

const Score: React.FC<ScoreProps> = ({
  score,
  combo,
  onHighScorePress,
  difficulty,
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 1:
        return Colors.primary;
      case 2:
        return Colors.accent;
      case 3:
        return "#FF9800";
      case 4:
        return Colors.danger;
      default:
        return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.blockWrapper}>
        <View
          style={[styles.blockShadow, { backgroundColor: Colors.accentDark }]}
        />
        <View style={[styles.block, { backgroundColor: Colors.accent }]}>
          <Text style={styles.blockValue}>{score}</Text>
        </View>
      </View>

      {combo > 0 && (
        <View style={styles.blockWrapper}>
          <View
            style={[
              styles.blockShadow,
              { backgroundColor: Colors.primaryDark },
            ]}
          />
          <View style={[styles.block, { backgroundColor: Colors.primary }]}>
            <Text style={styles.blockValue}>{combo}x</Text>
          </View>
        </View>
      )}

      {difficulty && (
        <View style={styles.blockWrapper}>
          <View
            style={[
              styles.blockShadow,
              { backgroundColor: getDifficultyColor() + "88" },
            ]}
          />
          <View
            style={[styles.block, { backgroundColor: getDifficultyColor() }]}
          >
            <Text style={styles.blockValue}>L{difficulty}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={onHighScorePress}
        style={styles.trophyButton}
        activeOpacity={0.7}
      >
        <Text style={styles.trophyText}>{"\u{1F3C6}"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  blockWrapper: {
    position: "relative",
  },
  block: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BLOCK_RADIUS - 4,
    zIndex: 2,
  },
  blockShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET - 1,
    bottom: -(BLOCK_SHADOW_OFFSET - 1),
    borderRadius: BLOCK_RADIUS - 4,
    zIndex: 1,
  },
  blockValue: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 1,
  },
  trophyButton: {
    width: 36,
    height: 36,
    borderRadius: BLOCK_RADIUS - 4,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  trophyText: {
    fontSize: 16,
  },
});

export default Score;
