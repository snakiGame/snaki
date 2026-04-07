import React, { useState, useCallback } from "react";
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

const BOARD_BORDER = 2;

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
  const [boardSize, setBoardSize] = useState({ w: 0, h: 0 });

  // Measure outer space then snap board to exact grid multiples
  // so the snake can reach every wall with no gap
  const handleOuterLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      const innerW = width - BOARD_BORDER * 2;
      const innerH = height - BOARD_BORDER * 2;
      const cols = Math.floor(innerW / GAME_UNIT_SIZE);
      const rows = Math.floor(innerH / GAME_UNIT_SIZE);
      const gridW = cols * GAME_UNIT_SIZE;
      const gridH = rows * GAME_UNIT_SIZE;
      setBoardSize({
        w: gridW + BOARD_BORDER * 2,
        h: gridH + BOARD_BORDER * 2,
      });
      onBoardLayout?.(gridW, gridH);
    },
    [onBoardLayout],
  );

  return (
    <View style={styles.boardOuter} onLayout={handleOuterLayout}>
      {boardSize.w > 0 && (
        <View
          style={[
            styles.boardContainer,
            { width: boardSize.w, height: boardSize.h },
          ]}
        >
          <View style={styles.boardShadow} />
          <View style={styles.boundaries}>
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
      )}
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
    alignItems: "center",
  },
  boardContainer: {
    // Explicit size set inline; children position relative to this
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
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderColor: Colors.surfaceLight,
    borderWidth: BOARD_BORDER,
    borderRadius: BLOCK_RADIUS,
    backgroundColor: Colors.surface,
    overflow: "hidden",
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
  },
});

export default GameBoard;
