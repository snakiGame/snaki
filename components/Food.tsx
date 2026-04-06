import React from "react";
import { View, StyleSheet } from "react-native";
import { Coordinate, FoodType } from "../types/types";
import { Colors } from "../styles/colors";
import { GAME_UNIT_SIZE } from "../lib/gameConstants";

interface FoodProps extends Coordinate {
  type: FoodType;
}

const Food: React.FC<FoodProps> = ({ x, y, type }) => {
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
    <View
      style={[
        styles.food,
        {
          left: x * GAME_UNIT_SIZE + offset,
          top: y * GAME_UNIT_SIZE + offset,
          width: size,
          height: size,
        },
      ]}
    >
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
    </View>
  );
};

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
});

export default Food;
