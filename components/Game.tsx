import React, { useState, useCallback, useEffect, useRef } from "react";
import { StyleSheet, StatusBar } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "../styles/colors";
import Header from "./Header";
import Score from "./Score";
import GameOverModal from "@/components/GameoverModal";
import ScoreModal from "./ScoreModal";
import GameBoard from "./GameBoard";
import { useGame } from "../hooks/useGame";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSwipeTrail } from "./SwipeTrail";

export default function Game(): JSX.Element {
  // Modal states
  const [isModalVisible, setModalVisible] = useState(false);
  const [isScoreModalVisible, setScoreModalVisible] = useState(false);

  // Actual playable area dimensions measured at runtime
  const [boardWidth, setBoardWidth] = useState(0);
  const [boardHeight, setBoardHeight] = useState(0);

  const handleBoardLayout = useCallback((w: number, h: number) => {
    setBoardWidth(w);
    setBoardHeight(h);
  }, []);

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

  // Swipe trail
  const { addDot, TrailLayer } = useSwipeTrail();
  const lastDotRef = useRef({ x: 0, y: 0 });

  const handleGestureWithTrail = useCallback(
    (event: any) => {
      const { absoluteX, absoluteY } = event.nativeEvent;
      const dx = absoluteX - lastDotRef.current.x;
      const dy = absoluteY - lastDotRef.current.y;
      if (dx * dx + dy * dy > 400) {
        addDot(absoluteX, absoluteY);
        lastDotRef.current = { x: absoluteX, y: absoluteY };
      }
      handleGesture(event);
    },
    [handleGesture, addDot],
  );

  const toggleModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

  const handleGameOver = useCallback(() => {
    setModalVisible(true);
  }, []);

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
        <TrailLayer />
        <Header
          reloadGame={resetGame}
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
          reloadGame={resetGame}
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
