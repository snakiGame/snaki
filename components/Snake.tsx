import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Coordinate } from "../types/types";
import { GAME_UNIT_SIZE } from "../lib/gameConstants";
import { Colors, BLOCK_RADIUS } from "../styles/colors";

interface SnakeProps {
  snake: Coordinate[];
}

export default function Snake({ snake }: SnakeProps): JSX.Element {
  return (
    <Fragment>
      {snake.map((segment: Coordinate, index: number) => {
        const isHead = index === 0;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                left: segment.x * GAME_UNIT_SIZE,
                top: segment.y * GAME_UNIT_SIZE,
                backgroundColor: isHead ? Colors.primary : Colors.primaryDark,
                opacity: Math.max(0.5, 1 - index * 0.03),
              },
            ]}
          >
            {/* Block shadow underneath each segment */}
            <View style={styles.segmentShadow} />
            {/* Head eye */}
            {isHead && <View style={styles.eye} />}
          </View>
        );
      })}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  segment: {
    width: GAME_UNIT_SIZE - 1,
    height: GAME_UNIT_SIZE - 1,
    position: "absolute",
    borderRadius: 3,
  },
  segmentShadow: {
    position: "absolute",
    left: 1,
    top: 2,
    right: -1,
    bottom: -2,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 3,
    zIndex: -1,
  },
  eye: {
    position: "absolute",
    width: Math.max(3, GAME_UNIT_SIZE * 0.25),
    height: Math.max(3, GAME_UNIT_SIZE * 0.25),
    backgroundColor: Colors.background,
    borderRadius: Math.max(3, GAME_UNIT_SIZE * 0.25) / 2,
    top: 2,
    right: 2,
  },
});
