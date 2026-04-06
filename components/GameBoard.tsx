import React from "react";
import { View, StyleSheet, Animated, LayoutChangeEvent } from "react-native";
import { Colors, BLOCK_RADIUS } from "../styles/colors";
import { Coordinate, FoodType, PowerUp } from "../types/types";
import { PowerUpState, GAME_UNIT_SIZE } from "../lib/gameConstants";
import Snake from "./Snake";
import Food from "./Food";
import PowerUpIndicator from "./PowerUpIndicator";
import ComboIndicator from "./ComboIndicator";
import PoisonOverlay from "./PoisonOverlay";

interface GameBoardProps {
  snake: Coordinate[];
  food: Coordinate;
  foodType: FoodType;
  powerUp: PowerUpState;
  combo: number;
  comboAnimation: Animated.Value;
  poisonEffect: boolean;
  onBoardLayout?: (width: number, height: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  foodType,
  powerUp,
  combo,
  comboAnimation,
  poisonEffect,
  onBoardLayout,
}) => {
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    onBoardLayout?.(width, height);
  };

  return (
    <View style={styles.boardOuter}>
      {/* Block shadow for the board */}
      <View style={styles.boardShadow} />
      <View style={styles.boundaries} onLayout={handleLayout}>
        {/* Grid pattern */}
        <GridLines />

        <PoisonOverlay isVisible={poisonEffect} />
        <Snake snake={snake} />
        <Food x={food.x} y={food.y} type={foodType} />

        {powerUp.type && (
          <PowerUpIndicator
            type={powerUp.type}
            timeLeft={Math.max(0, powerUp.endTime - Date.now())}
          />
        )}

        <ComboIndicator combo={combo} comboAnimation={comboAnimation} />
      </View>
    </View>
  );
};

// Subtle grid lines for the board
const GridLines: React.FC = React.memo(() => {
  // We render a pattern using border-based grid
  return <View style={styles.gridOverlay} />;
});

const styles = StyleSheet.create({
  boardOuter: {
    flex: 1,
    margin: 12,
    position: "relative",
  },
  boardShadow: {
    position: "absolute",
    left: 2,
    right: -2,
    top: 4,
    bottom: -4,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: BLOCK_RADIUS,
  },
  boundaries: {
    flex: 1,
    borderColor: Colors.surfaceLight,
    borderWidth: 2,
    borderRadius: BLOCK_RADIUS,
    backgroundColor: Colors.surface,
    overflow: "hidden",
    position: "relative",
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.06,
    backgroundColor: "transparent",
    borderColor: Colors.white,
    // Use a repeating background pattern via borderWidth as visual hint
  },
});

export default GameBoard;
