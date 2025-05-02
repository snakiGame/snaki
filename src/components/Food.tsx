import { StyleSheet, Text, View } from "react-native";
import { Coordinate } from "../types/types";
import { useState, useEffect } from "react";

function getRandomFruitEmoji() {
  const fruitEmojis = ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🍑", "🍍"];
  const randomIndex = Math.floor(Math.random() * fruitEmojis.length);
  return fruitEmojis[randomIndex];
}

export default function Food({ x, y }: Coordinate): JSX.Element {
  const [fruitEmoji, setFruitEmoji] = useState<string>("🍎");

  useEffect(() => {
    setFruitEmoji(getRandomFruitEmoji());
  }, [x, y]); // Change emoji when food position changes

  return <Text style={[{ top: y * 10, left: x * 10 }, styles.food]}>{fruitEmoji}</Text>;
}

const styles = StyleSheet.create({
  food: {
    width: 20,
    height: 20,
    borderRadius: 7,
    position: "absolute",
  },
});
