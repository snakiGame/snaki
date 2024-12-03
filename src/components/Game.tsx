import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, StatusBar, Alert, BackHandler, Vibration } from "react-native";
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
// import EkiliRelay from "ekilirelay";
// import ekilirelay from '../utils/ekilirelay';


const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { 
  xMin: 0, 
  xMax: 35, 
  yMin: 0, 
  yMax: 63 
};
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 2;

export default function Game(): JSX.Element {
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [ sound , setSound ] = useState<Audio.Sound | null>(null)

  const [currentBgMusic, setCurrentBgMusic ] = useState("bg-music1.mp3")
  const bgMusics = [
    "../../assets/music/bg-music1.mp3",
    "../../assets/music/bg-music2.mp3",
    "../../assets/music/stranger-things.mp3",
  ]


  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        // backgroundMusic()
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused]);

  useEffect(()=>{
    let rand_bg_music_index = Math.floor(Math.random() * bgMusics.length)
    setCurrentBgMusic(bgMusics[rand_bg_music_index])
    backgroundMusic()
  },[])

  const backgroundMusic = async () =>{
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/music/bg-music1.mp3"), 
      //bg-music1.mp3
      //bg-music2.mp3
      { shouldPlay: true, isLooping: true }
    );
    setSound(sound);
    // Playing the sound
    await sound.setVolumeAsync(0.25);
    await sound.playAsync();

  }
  const pickSound = async ()=>{
    Vibration.vibrate(30)
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../../assets/music/pick.mp3'), 
    //   { shouldPlay: true, isLooping: true }
    // );
    // setSound(sound);
    // // Playing the sound
    // await sound.setVolumeAsync(0.5);
    // await sound.playAsync();

  }
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
    const newHead = { ...snakeHead }; // create a new head object to avoid mutating the original head

    //playing the sound
    // GAME OVER
    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      
      setIsGameOver((prev) => !prev);
      Vibration.vibrate(300)
      Alert.alert(
        "Game Over",
        "You have hit a wall",
        [
          { text: 'exit', style: 'cancel', onPress: () => BackHandler.exitApp() },
          { text: 'Play again', onPress: () => reloadGame() }
        ]
      )
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
      pickSound()
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
      </SafeAreaView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:12,
    flex: 1,
    backgroundColor: Colors.primary,
  },
  boundaries: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 12,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: Colors.background,
  },
});
