import React from "react";
import { View, StyleSheet } from "react-native";
import { Coordinate } from "../types/types";
import { GAME_UNIT_SIZE } from "../lib/gameConstants";

interface ObstaclesProps {
  obstacles: Coordinate[];
}

const OBSTACLE_COLOR = "#64748b";
const OBSTACLE_SHADOW = "#475569";

const Obstacles: React.FC<ObstaclesProps> = React.memo(
  ({ obstacles }) => {
    const size = GAME_UNIT_SIZE - 2;
    const offset = (GAME_UNIT_SIZE - size) / 2;

    return (
      <>
        {obstacles.map((obs) => (
          <View
            key={`obs-${obs.x}-${obs.y}`}
            style={[
              styles.obstacle,
              {
                left: obs.x * GAME_UNIT_SIZE + offset,
                top: obs.y * GAME_UNIT_SIZE + offset,
                width: size,
                height: size,
              },
            ]}
          >
            <View
              style={[styles.obstacleShadow, { width: size, height: size }]}
            />
            <View style={[styles.obstacleBlock, { width: size, height: size }]}>
              {/* Cross pattern */}
              <View style={styles.crossH} />
              <View style={styles.crossV} />
            </View>
          </View>
        ))}
      </>
    );
  },
  (prev, next) => prev.obstacles === next.obstacles,
);

const styles = StyleSheet.create({
  obstacle: {
    position: "absolute",
  },
  obstacleBlock: {
    borderRadius: 3,
    backgroundColor: OBSTACLE_COLOR,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  obstacleShadow: {
    position: "absolute",
    left: 1,
    top: 2,
    borderRadius: 3,
    backgroundColor: OBSTACLE_SHADOW,
    zIndex: 1,
  },
  crossH: {
    position: "absolute",
    width: "60%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 1,
  },
  crossV: {
    position: "absolute",
    width: 2,
    height: "60%",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 1,
  },
});

export default Obstacles;
