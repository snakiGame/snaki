import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { SnakeProps } from "../types/types";
import { Colors } from "../styles/colors";
import { LinearGradient } from 'expo-linear-gradient';

export default function Snake({ snake }: SnakeProps): JSX.Element {
  return (
    <Fragment>
      {snake.map((segment: any, index: number) => {
        const segmentStyle = {
          left: segment.x * 10,
          top: segment.y * 10,
        };
        return (
          <LinearGradient
            key={index}
            colors={index === 0 ? 
              [Colors.primary, Colors.primary + 'CC'] : 
              [Colors.primary + 'CC', Colors.primary + '99']}
            style={[styles.snake, segmentStyle]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {index === 0 && <View style={styles.eye} />}
          </LinearGradient>
        );
      })}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  snake: {
    width: 15,
    height: 15,
    position: "absolute",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eye: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    top: 2,
    right: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
