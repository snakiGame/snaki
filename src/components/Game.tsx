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
  Animated,
  Easing,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "../styles/colors";
import { Direction, Coordinate, GestureEventType, PowerUp, FoodType } from "../types/types";
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
import GameOverModal from "@/components/GameoverModal";
import { backgroundMusic } from "@/lib/utils";
import PowerUpIndicator from "./PowerUpIndicator";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const MOVE_INTERVAL = 55;
const SCORE_INCREMENT = 1;
const BORDER_WIDTH = 12;
const GAME_UNIT_SIZE = 10;
const COMBO_THRESHOLD = 3; 
const COMBO_TIMEOUT = 2000; 
const POWER_UP_DURATION = 5000; 

interface GameBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface PowerUpState {
  type: PowerUp | null;
  endTime: number;
}

export default function Game(): JSX.Element {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [foodType, setFoodType] = useState<FoodType>(FoodType.Normal);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [combo, setCombo] = useState<number>(0);
  const [lastFoodTime, setLastFoodTime] = useState<number>(0);
  const [powerUp, setPowerUp] = useState<PowerUpState>({ type: null, endTime: 0 });
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [comboAnimation] = useState(new Animated.Value(0));
  const [highScore, setHighScore] = useState<number>(0);
  const [foodAnimation] = useState(new Animated.Value(0));

  const { settings } = useSettingStore();

  const gameBounds: GameBounds = {
    xMin: 0,
    xMax: Math.floor((screenWidth - (BORDER_WIDTH * 2)) / GAME_UNIT_SIZE),
    yMin: 0,
    yMax: Math.floor((screenHeight - (BORDER_WIDTH * 2)) / GAME_UNIT_SIZE),
  };
  console.log(gameBounds)

  const toggleModal = useCallback(() => {
    setModalVisible(prev => !prev);
  }, []);

  // Handle combo system
  const updateCombo = useCallback(() => {
    const now = Date.now();
    if (now - lastFoodTime < COMBO_TIMEOUT) {
      setCombo(prev => {
        const newCombo = prev + 1;
        if (newCombo >= COMBO_THRESHOLD) {

          // Trigger combo animation
          Animated.sequence([
            Animated.timing(comboAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(comboAnimation, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
        return newCombo;
      });
    } else {
      setCombo(1);
    }
    setLastFoodTime(now);
  }, [lastFoodTime, comboAnimation]);

  // Handle power-ups
  const activatePowerUp = useCallback((type: PowerUp) => {
    setPowerUp({ type, endTime: Date.now() + POWER_UP_DURATION });
    switch (type) {
      case PowerUp.Speed:
        setSpeedMultiplier(1.5);
        break;
      case PowerUp.Slow:
        setSpeedMultiplier(0.7);
        break;
      case PowerUp.DoublePoints:
        // Handled in score calculation
        break;
    }
  }, []);

  
  useEffect(() => {
    if (powerUp.type && Date.now() > powerUp.endTime) {
      setPowerUp({ type: null, endTime: 0 });
      setSpeedMultiplier(1);
    }
  }, [powerUp]);

  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL / speedMultiplier);
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused, speedMultiplier]);

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

  const calculateScore = useCallback((baseScore: number) => {
    let finalScore = baseScore;
    
    if (combo >= COMBO_THRESHOLD) {
      finalScore *= Math.min(combo, 5);
    }
    
    if (powerUp.type === PowerUp.DoublePoints) {
      finalScore *= 2;
    }
    return finalScore;
  }, [combo, powerUp.type]);

  const moveSnake = useCallback(() => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead };

    if (checkGameOver(snakeHead, gameBounds)) {
      if (score > highScore) {
        setHighScore(score);
      }
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
      // Random chance for special food or power-up
      const random = Math.random();
      if (random < 0.1) { 
        const powerUps = Object.values(PowerUp);
        const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
        activatePowerUp(randomPowerUp);
      } else if (random < 0.3) {
        const foodTypes = Object.values(FoodType);
        setFoodType(foodTypes[Math.floor(Math.random() * foodTypes.length)]);
      } else {
        setFoodType(FoodType.Normal);
      }

      setFood(randomFoodPosition(gameBounds.xMax, gameBounds.yMax));
      setSnake([newHead, ...snake]);
      vibrate(25);
      updateCombo();
      setScore(prev => prev + calculateScore(SCORE_INCREMENT));
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  }, [snake, direction, food, gameBounds, vibrate, combo, powerUp, calculateScore, updateCombo, activatePowerUp, score, highScore]);

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
    setFoodType(FoodType.Normal);
    setIsGameOver(false);
    setScore(0);
    setCombo(0);
    setDirection(Direction.Right);
    setIsPaused(false);
    setPowerUp({ type: null, endTime: 0 });
    setSpeedMultiplier(1);
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
          <Score score={score} highScore={highScore} combo={combo} />
        </Header>
        <View style={styles.boundaries}>
          <Snake snake={snake} />
          <Food x={food.x} y={food.y} type={foodType} />
          {powerUp.type && (
            <PowerUpIndicator
              type={powerUp.type}
              timeLeft={Math.max(0, powerUp.endTime - Date.now())}
            />
          )}
          {combo >= COMBO_THRESHOLD && (
            <Animated.Text
              style={[
                styles.comboText,
                {
                  transform: [
                    {
                      scale: comboAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            >
              {combo}x COMBO!
            </Animated.Text>
          )}
        </View>

        <GameOverModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          reloadGame={reloadGame}
          // score={score}
          // highScore={highScore}
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
  comboText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
