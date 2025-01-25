import { useEffect, useState } from "react";
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
} from "@/lib/settings";
import ModalComponent from "@/components/Modal";
import GameOverModal from "@/components/GameoverModal";
import { backgroundMusic } from "@/lib/utils";
import { dbInit } from "@/lib/db";
import * as SQLite from "expo-sqlite";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = {
  xMin: 0,
  xMax: 35,
  yMin: 0,
  yMax: 63,
};
const MOVE_INTERVAL = 55;
const SCORE_INCREMENT = 1;

interface Score {
  id: string;
  score: string;
  date: string;
}

export default function Game(): JSX.Element {
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { settings } = useSettingStore();

  // const insertScore = async (score: number) => {
  //   const db = SQLite.openDatabase("snaki.db"); // No `await` here
  //   try {
  //     const date = new Date().toISOString();
  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         "INSERT INTO scores (score, date) VALUES (?, ?)",
  //         [score, date],
  //         () => {
  //           console.log("Score inserted successfully.");
  //         },
  //         (txObj, error) => {
  //           console.error("Error inserting score:", error);
  //           return false;
  //         }
  //       );
  //     });
  //   } catch (error) {
  //     console.error("Database error:", error);
  //   }
  // };


  // const getScores = async () => {
  //   const allRows = await db.getAllAsync("SELECT * FROM test");
  //   let scores
  //   for (const row of allRows) {
  //     let score:Score||Unknown = row
  //     scores.push(score)
  //     console.log(row.id, row.score, row.date);
  //   }
  // };

  const [currentBgMusic, setCurrentBgMusic] = useState("bg-music1.mp3");
  const bgMusics = [
    "../../assets/music/bg-music1.mp3",
    "../../assets/music/bg-music2.mp3",
    "../../assets/music/stranger-things.mp3",
  ];

  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        // backgroundMusic()
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused]);

  useEffect(() => {
    let rand_bg_music_index = Math.floor(Math.random() * bgMusics.length);
    setCurrentBgMusic(bgMusics[rand_bg_music_index]);
    backgroundMusic();
  }, []);

  const vibrate = async (length: number) => {
    if (!settings.vibration) {
      return;
    }
    Vibration.vibrate(length);
  };
  useEffect(() => {
    // Clean up the sound on unmount
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead }; // creating a new head object to avoid mutating the original head

    //playing the sound
    // GAME OVER
    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      setIsGameOver((prev) => !prev);
      vibrate(300);
      setModalVisible(true);
      // insertScore(score);
      
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
      default:
        break;
    }

    if (checkEatsFood(newHead, food, 2)) {
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      vibrate(25);
      setScore(score + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };

  const handleGesture = (event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setDirection(Direction.Right);
      } else {
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0) {
        setDirection(Direction.Down);
      } else {
        setDirection(Direction.Up);
      }
    }
  };

  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
  };

  const pauseGame = () => {
    console.log("Game paused");
    setIsPaused(!isPaused);
  };

  // console.log(JSON.stringify(snake, null, 0));

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={"light-content"}
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

        {/* game over modal */}
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
    borderWidth: 12,
    // borderRadius: 25,
    backgroundColor: Colors.background,
  },
});
