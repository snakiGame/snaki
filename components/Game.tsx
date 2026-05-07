import React, { useState, useCallback, useEffect, useRef } from "react";
import { StyleSheet, StatusBar, Animated } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "../styles/colors";
import Header from "./Header";
import Score from "./Score";
import GameOverModal from "@/components/GameoverModal";
import ScoreModal from "./ScoreModal";
import GameBoard from "./GameBoard";
import { useGame } from "../hooks/useGame";
import { SafeAreaView } from "react-native-safe-area-context";
import SwipeTrail, { SwipeTrailHandle } from "./SwipeTrail";
import { useDailyChallengeStore } from "@/lib/challengeStore";
import { useAchievementStore } from "@/lib/achievementStore";
import { useScoreStore } from "@/lib/scoreStore";
import { SNAKE_SKINS } from "@/lib/skinStore";
import { FoodType } from "@/types/types";
import NewHighScoreModal from "./NewHighScoreModal";

export default function Game(): JSX.Element {
  // Modal states
  const [isModalVisible, setModalVisible] = useState(false);
  const [isScoreModalVisible, setScoreModalVisible] = useState(false);
  const [showHighScoreModal, setShowHighScoreModal] = useState(false);

  // Actual playable area dimensions measured at runtime
  const [boardWidth, setBoardWidth] = useState(0);
  const [boardHeight, setBoardHeight] = useState(0);

  const handleBoardLayout = useCallback((w: number, h: number) => {
    setBoardWidth(w);
    setBoardHeight(h);
  }, []);

  // ── Screen shake ──
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const triggerShake = useCallback(
    (intensity: number = 6) => {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: intensity,
          duration: 40,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -intensity,
          duration: 40,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: intensity * 0.6,
          duration: 35,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -intensity * 0.6,
          duration: 35,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 30,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [shakeAnim],
  );

  // Use the consolidated game hook
  const {
    snake,
    food,
    foodType,
    score,
    isGameOver,
    isPaused,
    combo,
    powerUp,
    currentDifficulty,
    poisonEffect,
    localHighScore,
    comboAnimation,
    handleGesture,
    resetGame,
    togglePause,
  } = useGame({ boardWidth, boardHeight });

  // ── Per-game stats tracking for challenges & achievements ──
  const gameStatsRef = useRef({
    goldenEaten: 0,
    rainbowEaten: 0,
    poisonEaten: 0,
    totalFoodEaten: 0,
    maxCombo: 0,
    atePoison: false,
  });
  const prevSnakeLenRef = useRef(snake.length);
  const prevFoodTypeRef = useRef(foodType);

  // Track food eating by watching snake length changes
  useEffect(() => {
    if (isGameOver) return;
    const prevLen = prevSnakeLenRef.current;
    const grew = snake.length > prevLen;
    const shrank = snake.length < prevLen;
    prevSnakeLenRef.current = snake.length;

    if (grew) {
      gameStatsRef.current.totalFoodEaten++;
      const eaten = prevFoodTypeRef.current;
      if (eaten === FoodType.Golden) gameStatsRef.current.goldenEaten++;
      if (eaten === FoodType.Rainbow) gameStatsRef.current.rainbowEaten++;
    }
    if (shrank) {
      gameStatsRef.current.poisonEaten++;
      gameStatsRef.current.atePoison = true;
      triggerShake(5);
    }
  }, [snake.length, isGameOver, triggerShake]);

  // Track food type changes for next detection
  useEffect(() => {
    prevFoodTypeRef.current = foodType;
  }, [foodType]);

  // Track max combo
  useEffect(() => {
    if (combo > gameStatsRef.current.maxCombo) {
      gameStatsRef.current.maxCombo = combo;
    }
  }, [combo]);

  // ── Fire challenges + achievements on game over ──
  const { updateProgress, refreshIfNeeded } = useDailyChallengeStore();
  const { unlock } = useAchievementStore();
  const { scores, highScore: storeHighScore } = useScoreStore();

  useEffect(() => {
    refreshIfNeeded();
  }, []);

  const processedGameOverRef = useRef(false);

  useEffect(() => {
    if (!isGameOver || processedGameOverRef.current) return;
    processedGameOverRef.current = true;

    const stats = gameStatsRef.current;

    // Update daily challenge progress
    if (score > 0) updateProgress("score", score);
    if (stats.maxCombo > 0) updateProgress("combo", stats.maxCombo);
    if (stats.goldenEaten > 0) updateProgress("golden", stats.goldenEaten);
    if (stats.rainbowEaten > 0) updateProgress("rainbow", stats.rainbowEaten);
    if (stats.totalFoodEaten > 0)
      updateProgress("food_count", stats.totalFoodEaten);
    if (!stats.atePoison && score > 0) updateProgress("no_poison", score);

    // Check achievements
    unlock("first_game");
    if (score >= 10) unlock("score_10");
    if (score >= 50) unlock("score_50");
    if (score >= 100) unlock("score_100");
    if (score >= 200) unlock("score_200");
    if (stats.maxCombo >= 3) unlock("combo_3");
    if (stats.maxCombo >= 5) unlock("combo_5");
    if (stats.goldenEaten > 0) unlock("golden_eat");
    if (stats.rainbowEaten > 0) unlock("rainbow_eat");
    if (stats.atePoison) unlock("poison_survive");

    // Games played achievements
    const gamesPlayed = scores.length;
    if (gamesPlayed >= 10) unlock("games_10");
    if (gamesPlayed >= 50) unlock("games_50");

    // Streak achievements
    const { streak } = useDailyChallengeStore.getState();
    if (streak >= 3) unlock("streak_3");
    if (streak >= 7) unlock("streak_7");

    // Level achievements
    const { level } = useDailyChallengeStore.getState();
    if (level >= 5) unlock("level_5");

    // All skins unlocked
    const best = Math.max(score, storeHighScore);
    const allSkinsUnlocked = SNAKE_SKINS.every((s) => s.unlockScore <= best);
    if (allSkinsUnlocked) unlock("all_skins");
  }, [isGameOver]);

  // Reset per-game stats when game restarts
  const handleResetGame = useCallback(() => {
    gameStatsRef.current = {
      goldenEaten: 0,
      rainbowEaten: 0,
      poisonEaten: 0,
      totalFoodEaten: 0,
      maxCombo: 0,
      atePoison: false,
    };
    prevSnakeLenRef.current = 1;
    processedGameOverRef.current = false;
    resetGame();
  }, [resetGame]);

  // Swipe trail (ref-based to avoid re-rendering Game)
  const trailRef = useRef<SwipeTrailHandle>(null);
  const lastDotRef = useRef({ x: 0, y: 0 });

  const handleGestureWithTrail = useCallback(
    (event: any) => {
      const { absoluteX, absoluteY } = event.nativeEvent;
      const dx = absoluteX - lastDotRef.current.x;
      const dy = absoluteY - lastDotRef.current.y;
      if (dx * dx + dy * dy > 400) {
        trailRef.current?.addDot(absoluteX, absoluteY);
        lastDotRef.current = { x: absoluteX, y: absoluteY };
      }
      handleGesture(event);
    },
    [handleGesture],
  );

  const toggleModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

  const handleGameOver = useCallback(() => {
    triggerShake(10);
    setModalVisible(true);
  }, [triggerShake]);

  const handleHighScorePress = useCallback(() => {
    togglePause();
    setScoreModalVisible(true);
  }, [togglePause]);

  const handleScoreModalClose = useCallback(() => {
    setScoreModalVisible(false);
    if (isPaused) {
      togglePause();
    }
  }, [isPaused, togglePause]);

  // Show game over modal when game ends
  useEffect(() => {
    if (isGameOver && !isModalVisible) {
      handleGameOver();
    }
  }, [isGameOver, isModalVisible, handleGameOver]);

  return (
    <PanGestureHandler onGestureEvent={handleGestureWithTrail}>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <SwipeTrail ref={trailRef} />
        <Header
          reloadGame={handleResetGame}
          pauseGame={togglePause}
          isPaused={isPaused}
        >
          <Score
            score={score}
            combo={combo}
            difficulty={currentDifficulty}
            onHighScorePress={handleHighScorePress}
          />
        </Header>

        <GameBoard
          snake={snake}
          food={food}
          foodType={foodType}
          powerUp={powerUp}
          combo={combo}
          comboAnimation={comboAnimation}
          poisonEffect={poisonEffect}
          onBoardLayout={handleBoardLayout}
        />

        <GameOverModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          reloadGame={handleResetGame}
          score={score}
          highScore={localHighScore}
        />

        <ScoreModal
          isVisible={isScoreModalVisible}
          onClose={handleScoreModalClose}
        />
      </SafeAreaView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
