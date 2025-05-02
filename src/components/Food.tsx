import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Coordinate, FoodType } from '../types/types';
import { Colors } from '../styles/colors';

interface FoodProps extends Coordinate {
  type: FoodType;
}

const Food: React.FC<FoodProps> = ({ x, y, type }) => {
  const getFoodColor = () => {
    switch (type) {
      case FoodType.Golden:
        return '#FFD700'; // Gold
      case FoodType.Rainbow:
        return '#FF69B4'; // Hot Pink
      case FoodType.Poison:
        return '#FF0000'; // Red
      default:
        return Colors.primary;
    }
  };

  const getFoodStyle = () => {
    switch (type) {
      case FoodType.Golden:
        return styles.goldenFood;
      case FoodType.Rainbow:
        return styles.rainbowFood;
      case FoodType.Poison:
        return styles.poisonFood;
      default:
        return styles.normalFood;
    }
  };

  const getFoodSize = () => {
    switch (type) {
      case FoodType.Golden:
        return 12;
      case FoodType.Rainbow:
        return 14;
      case FoodType.Poison:
        return 10;
      default:
        return 10;
    }
  };

  return (
    <View
      style={[
        styles.food,
        {
          left: x * 10,
          top: y * 10,
          backgroundColor: getFoodColor(),
          width: getFoodSize(),
          height: getFoodSize(),
          borderRadius: getFoodSize() / 2,
        },
        getFoodStyle(),
      ]}
    />
  );
};

const styles = StyleSheet.create({
  food: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalFood: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goldenFood: {
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  rainbowFood: {
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF1493',
  },
  poisonFood: {
    shadowColor: '#FF0000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
});

export default Food;
