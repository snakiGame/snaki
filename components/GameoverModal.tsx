import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import Modal from "react-native-modal";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import useSettingStore from "@/lib/settings";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface GameoverModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  reloadGame: () => void;
  score: number;
  highScore: number;
}

const { width } = Dimensions.get("window");

const GameOverModal = ({
  isModalVisible,
  toggleModal,
  reloadGame,
  score,
  highScore,
}: GameoverModalProps) => {
  const { settings } = useSettingStore();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const isNewBest = score > 0 && score >= highScore;

  useEffect(() => {
    if (isModalVisible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [isModalVisible]);

  return (
    <Modal
      isVisible={isModalVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      backdropOpacity={0.85}
      style={styles.modal}
    >
      <Animated.View
        style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Title */}
        <Text style={styles.title}>GAME OVER</Text>

        {/* New best badge */}
        {isNewBest && (
          <View style={styles.newBestBadge}>
            <View style={styles.newBestShadow} />
            <View style={styles.newBestInner}>
              <Text style={styles.newBestText}>NEW BEST!</Text>
            </View>
          </View>
        )}

        {/* Score blocks */}
        <View style={styles.scoreRow}>
          <View style={styles.scoreBlock}>
            <View
              style={[
                styles.scoreBlockShadow,
                { backgroundColor: Colors.accentDark },
              ]}
            />
            <View
              style={[
                styles.scoreBlockInner,
                { backgroundColor: Colors.accent },
              ]}
            >
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
          </View>
          <View style={styles.scoreBlock}>
            <View
              style={[
                styles.scoreBlockShadow,
                { backgroundColor: Colors.surfaceLight },
              ]}
            />
            <View
              style={[
                styles.scoreBlockInner,
                { backgroundColor: Colors.surface },
              ]}
            >
              <Text style={styles.scoreLabel}>BEST</Text>
              <Text style={styles.scoreValue}>
                {Math.max(score, highScore)}
              </Text>
            </View>
          </View>
        </View>

        {/* Play Again button */}
        <View style={styles.buttonWrapper}>
          <View
            style={[
              styles.buttonShadow,
              { backgroundColor: Colors.primaryDark },
            ]}
          />
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={() => {
              if (settings.vibration) Vibration.vibrate(15);
              toggleModal();
              reloadGame();
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="reload"
              size={20}
              color={Colors.background}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.playAgainText}>PLAY AGAIN</Text>
          </TouchableOpacity>
        </View>

        {/* Home button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => {
            toggleModal();
            router.replace("/");
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.homeButtonText}>HOME</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.82,
    padding: 28,
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BLOCK_RADIUS,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: Colors.danger,
    letterSpacing: 4,
    marginBottom: 16,
    textShadowColor: Colors.dangerDark,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  newBestBadge: {
    position: "relative",
    marginBottom: 20,
  },
  newBestShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    backgroundColor: Colors.accentDark,
    borderRadius: BLOCK_RADIUS,
  },
  newBestInner: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: BLOCK_RADIUS,
  },
  newBestText: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 3,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  scoreBlock: {
    flex: 1,
    position: "relative",
  },
  scoreBlockShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    borderRadius: BLOCK_RADIUS,
  },
  scoreBlockInner: {
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: BLOCK_RADIUS,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 2,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.white,
  },
  buttonWrapper: {
    width: "100%",
    position: "relative",
    marginBottom: 12,
  },
  buttonShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    borderRadius: BLOCK_RADIUS,
  },
  playAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BLOCK_RADIUS,
    width: "100%",
  },
  playAgainText: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 3,
  },
  homeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  homeButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textDim,
    letterSpacing: 2,
  },
});

export default GameOverModal;
