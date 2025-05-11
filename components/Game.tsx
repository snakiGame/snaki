import { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Vibration,
  useWindowDimensions,
  Animated,
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
import { LinearGradient } from 'expo-linear-gradient';
import ScoreModal from './ScoreModal';
import { useScoreStore } from '@/lib/scoreStore';

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const BASE_MOVE_INTERVAL = 55; // Base speed
const DIFFICULTY_LEVELS = [
  { score: 0, interval: 55 },    // Level 1: Normal speed
  { score: 20, interval: 45 },   // Level 2: Faster
  { score: 50, interval: 35 },   // Level 3: Even faster
  { score: 100, interval: 25 },  // Level 4: Very fast
];
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
  const { highScore, addScore } = useScoreStore();
  const [localHighScore, setLocalHighScore] = useState<number>(highScore);
  const [foodAnimation] = useState(new Animated.Value(0));
  const [isScoreModalVisible, setScoreModalVisible] = useState(false);
  const [poisonEffect, setPoisonEffect] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(1);

  const { settings } = useSettingStore();

  const gameBounds: GameBounds = {
    xMin: 0,
    xMax: Math.floor((screenWidth - (BORDER_WIDTH * 2)) / GAME_UNIT_SIZE),
    yMin: 0,
    yMax: Math.floor((screenHeight - (BORDER_WIDTH * 2)) / GAME_UNIT_SIZE),
  };

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

  // Calculate current move interval based on score and difficulty levels
  const getCurrentMoveInterval = useCallback(() => {
    // Find the highest difficulty level that the player has reached
    const currentLevel = [...DIFFICULTY_LEVELS]
      .reverse()
      .find(level => score >= level.score);

    // Update the current difficulty level
    const difficultyIndex = DIFFICULTY_LEVELS.findIndex(level => 
      level.interval === currentLevel?.interval
    );
    setCurrentDifficulty(difficultyIndex + 1); // +1 because levels are 1-based

    // Use the interval from that level, or the base interval if no level is found
    return (currentLevel?.interval || BASE_MOVE_INTERVAL) / speedMultiplier;
  }, [score, speedMultiplier]);

  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        !isPaused && moveSnake();
      }, getCurrentMoveInterval());
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused, speedMultiplier, getCurrentMoveInterval]);

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

    if (checkGameOver(snakeHead, gameBounds, snake)) {
      if (score > localHighScore) {
        addScore(score);
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
      // Handle different food types
      if (foodType === FoodType.Poison) {
        // Poison food has negative effects
        vibrate(100); // Stronger vibration for poison

        // Reduce score
        setScore(prev => Math.max(0, prev - 5));

        // Shrink snake if possible (don't go below length 1)
        if (snake.length > 1) {
          setSnake([newHead, ...snake.slice(0, -2)]);
        } else {
          setSnake([newHead]);
        }

        // Reset combo
        setCombo(0);

        // Show poison effect
        setPoisonEffect(true);
        setTimeout(() => setPoisonEffect(false), 1000);
      } else {
        // Normal food behavior
        setSnake([newHead, ...snake]);
        vibrate(25);
        updateCombo();

        // Different score based on food type
        let scoreIncrement = SCORE_INCREMENT;
        if (foodType === FoodType.Golden) {
          scoreIncrement = 3;
        } else if (foodType === FoodType.Rainbow) {
          scoreIncrement = 5;
        }

        setScore(prev => prev + calculateScore(scoreIncrement));
      }

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
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  }, [snake, direction, food, gameBounds, vibrate, combo, powerUp, calculateScore, updateCombo, activatePowerUp, score, localHighScore, addScore]);

  const handleGesture = useCallback((event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;

    // Prevent reversing direction (e.g., going right then immediately left)
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0 && direction !== Direction.Left) {
        setDirection(Direction.Right);
      } else if (translationX < 0 && direction !== Direction.Right) {
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0 && direction !== Direction.Up) {
        setDirection(Direction.Down);
      } else if (translationY < 0 && direction !== Direction.Down) {
        setDirection(Direction.Up);
      }
    }
  }, [direction]);

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

  const pauseGame = useCallback(() => { //pauses and unpauses the game
    setIsPaused(prev => !prev);
  }, []);

  // Update local high score when store changes
  useEffect(() => {
    setLocalHighScore(highScore);
  }, [highScore]);

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
          <Score
            score={score}
            combo={combo}
            difficulty={currentDifficulty}
            onHighScorePress={() => {
              pauseGame()
              setScoreModalVisible(true)
            }}
          />
        </Header>
        <View style={styles.boundaries}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.gridBackground}
          />
          {poisonEffect && (
            <View style={styles.poisonOverlay} />
          )}
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
          score={score}
          highScore={localHighScore}
        />

        <ScoreModal
          isVisible={isScoreModalVisible}
          onClose={() => {
            setScoreModalVisible(false);
            // Only unpause if the game was paused when opening the modal
            if (isPaused) {
              pauseGame();
            }
          }}
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
    margin: 15,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderRadius: settings_isRondedEdges() ? 30 : 0,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  comboText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  poisonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    zIndex: 1,
  },
});
