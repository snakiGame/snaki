import { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  BackHandler,
  Vibration,
  Text,
  Button,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "../styles/colors";
import { Direction, Coordinate, GestureEventType } from "../types/types";
import { checkEatsFood } from "../utils/checkEatsFood";
import { checkGameOver } from "../utils/checkGameOver";
import { randomFoodPosition } from "../utils/randomFoodPosition";
import { Audio } from "expo-av";
import Food from "./Food";
import Header from "./Header";
import Score from "./Score";
import Snake from "./Snake";
import useSettingStore, {
  settings_Vibration,
  settings_backgroundMusic,
  settings_isRondedEdges,
} from "@/lib/settings";
import ModalComponent from "@/components/Modal";
import GameOverModal from "@/components/GameoverModal";
import { backgroundMusic } from "@/lib/utils";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const MOVE_INTERVAL = 55;
const SCORE_INCREMENT = 1;
const BORDER_WIDTH = 12;
const GAME_UNIT_SIZE = 10;

interface GameBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface Score {
  id: string;
  score: string;
  date: string;
}

export default function Game(): JSX.Element {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);

  const { settings } = useSettingStore();

  // Calculate game bounds based on screen dimensions
  const gameBounds: GameBounds = {
    xMin: 0,
    xMax: Math.floor((screenWidth - (BORDER_WIDTH * 2)) / GAME_UNIT_SIZE),
    yMin: 0,
    yMax: Math.floor((screenHeight - (BORDER_WIDTH * 2)) / GAME_UNIT_SIZE),
  };

  const toggleModal = useCallback(() => {
    setModalVisible(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused]);

  useEffect(() => {
    backgroundMusic();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const vibrate = useCallback(async (length: number) => {
    if (!settings.vibration) return;
    Vibration.vibrate(length);
  }, [settings.vibration]);

  const moveSnake = useCallback(() => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead };

    if (checkGameOver(snakeHead, gameBounds)) {
      setIsGameOver(true);
      vibrate(300);
      setModalVisible(true);
      return;
    }

    switch (direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
    }

    if (checkEatsFood(newHead, food, 2)) {
      setFood(randomFoodPosition(gameBounds.xMax, gameBounds.yMax));
      setSnake([newHead, ...snake]);
      vibrate(25);
      setScore(prev => prev + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  }, [snake, direction, food, gameBounds, vibrate]);

  const handleGesture = useCallback((event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      setDirection(translationX > 0 ? Direction.Right : Direction.Left);
    } else {
      setDirection(translationY > 0 ? Direction.Down : Direction.Up);
    }
  }, []);

  const reloadGame = useCallback(() => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.primary}
        />
        <Header
          reloadGame={reloadGame}
          pauseGame={pauseGame}
          isPaused={isPaused}
        >
          <Score score={score} />
        </Header>
        <View style={styles.boundaries}>
          <Snake snake={snake} />
          <Food x={food.x} y={food.y} />
        </View>

        <GameOverModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          reloadGame={reloadGame}
        />
      </SafeAreaView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  boundaries: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: BORDER_WIDTH,
    borderRadius: settings_isRondedEdges() ? 10 : 0,
    backgroundColor: Colors.background,
  },
});
