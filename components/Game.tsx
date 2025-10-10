import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "../styles/colors";
import Header from "./Header";
import Score from "./Score";
import GameOverModal from "@/components/GameoverModal";
import ScoreModal from './ScoreModal';
import GameBoard from './GameBoard';
import { useGame } from '../hooks/useGame';

export default function Game(): JSX.Element {
  // Modal states
  const [isModalVisible, setModalVisible] = useState(false);
  const [isScoreModalVisible, setScoreModalVisible] = useState(false);

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
  } = useGame();

  const toggleModal = useCallback(() => {
    setModalVisible(prev => !prev);
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
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.primary}
        />
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
    backgroundColor: Colors.primary,
  },
});