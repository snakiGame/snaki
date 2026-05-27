import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Dimensions,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import useSettingStore from "@/lib/settings";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SNAKE_SKINS } from "@/lib/skinStore";
import { useAchievementStore, ACHIEVEMENTS } from "@/lib/achievementStore";
import { useDailyChallengeStore, xpForLevel } from "@/lib/challengeStore";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

interface GameoverModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  reloadGame: () => void;
  score: number;
  highScore: number;
  runMaxCombo: number;
  bestCombo: number;
}

const { width } = Dimensions.get("window");

const GameOverModal = ({
  isModalVisible,
  toggleModal,
  reloadGame,
  score,
  highScore,
  runMaxCombo,
  bestCombo,
}: GameoverModalProps) => {
  const { settings } = useSettingStore();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shareCardRef = useRef<any>(null);
  const isNewBest = score > 0 && score >= highScore;

  const handleShare = useCallback(async () => {
    try {
      const uri = await captureRef(shareCardRef, {
        format: "png",
        quality: 1,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share your Snaki score!",
        });
      }
    } catch (e) {
      console.warn("Share failed:", e);
    }
  }, []);

  const { newlyUnlocked, markSeen } = useAchievementStore();
  const { challenges, definitions, xp, level, streak } =
    useDailyChallengeStore();

  // Next locked skin
  const bestScore = Math.max(score, highScore);
  const nextSkin = SNAKE_SKINS.find((s) => s.unlockScore > bestScore);
  const xpNeeded = xpForLevel(level);
  const xpProgress = xpNeeded > 0 ? Math.min(xp / xpNeeded, 1) : 0;

  // Achievement names for newly unlocked
  const unlockedAchievements = newlyUnlocked
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean);

  // Challenge progress that can be claimed now
  const completedChallenges = challenges.filter(
    (c) => c.completed && !c.claimed,
  );
  const claimableXp = completedChallenges.reduce((sum, challenge) => {
    const def = definitions.find((d) => d.id === challenge.challengeId);
    return sum + (def?.xpReward ?? 0);
  }, 0);

  useEffect(() => {
    if (isModalVisible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      // Mark achievements as seen when modal closes
      if (newlyUnlocked.length > 0) markSeen();
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

        {/* Combo feedback */}
        <View style={styles.comboCompareCard}>
          <View style={styles.comboCompareRow}>
            <Text style={styles.comboCompareLabel}>RUN COMBO</Text>
            <Text style={styles.comboCompareValue}>{runMaxCombo}x</Text>
          </View>
          <View style={styles.comboCompareRow}>
            <Text style={styles.comboCompareLabel}>BEST COMBO</Text>
            <Text style={styles.comboCompareValue}>{bestCombo}x</Text>
          </View>
        </View>

        {/* XP & Level progress */}
        <View style={styles.xpSection}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLevelText}>LVL {level}</Text>
            <Text style={styles.xpText}>
              {xp}/{xpNeeded} XP
            </Text>
          </View>
          <View style={styles.xpBarBg}>
            <View
              style={[styles.xpBarFill, { width: `${xpProgress * 100}%` }]}
            />
          </View>
          {streak > 0 && (
            <Text style={styles.streakText}>
              {"\u{1F525}"} {streak} day streak
            </Text>
          )}
        </View>

        {/* Newly unlocked achievements */}
        {unlockedAchievements.length > 0 && (
          <View style={styles.achievementSection}>
            {unlockedAchievements.map((a) => (
              <View key={a!.id} style={styles.achievementRow}>
                <Ionicons
                  name={a!.icon as any}
                  size={18}
                  color={Colors.accent}
                />
                <Text style={styles.achievementText}>{a!.title}</Text>
                <Text style={styles.achievementBadge}>NEW</Text>
              </View>
            ))}
          </View>
        )}

        {/* Challenge progress */}
        {completedChallenges.length > 0 && (
          <View style={styles.challengeSection}>
            <Text style={styles.challengeSectionTitle}>CHALLENGES</Text>
            {completedChallenges.map((c) => {
              const def = definitions.find((d) => d.id === c.challengeId);
              if (!def) return null;
              return (
                <View key={c.challengeId} style={styles.challengeRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={styles.challengeText}>{def.title}</Text>
                  <Text style={styles.challengeXp}>+{def.xpReward} XP</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* XP breakdown */}
        <View style={styles.xpBreakdownSection}>
          <Text style={styles.challengeSectionTitle}>XP BREAKDOWN</Text>
          <View style={styles.challengeRow}>
            <Text style={styles.challengeText}>Claimable from challenges</Text>
            <Text style={styles.challengeXp}>+{claimableXp} XP</Text>
          </View>
        </View>

        {/* Next skin unlock hint */}
        {nextSkin && (
          <View style={styles.nextSkinHint}>
            <View
              style={[styles.nextSkinDot, { backgroundColor: nextSkin.head }]}
            />
            <Text style={styles.nextSkinText}>
              {nextSkin.unlockScore - bestScore} more to unlock {nextSkin.name}
            </Text>
          </View>
        )}

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

        {/* Home & Share row */}
        <View style={styles.bottomRow}>
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

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={16} color={Colors.accent} />
            <Text style={styles.shareButtonText}>SHARE</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Hidden share card — rendered offscreen for capture */}
      <View style={styles.shareCardWrapper} pointerEvents="none">
        <ViewShot ref={shareCardRef} options={{ format: "png", quality: 1 }}>
          <View style={styles.shareCard}>
            <Text style={styles.shareCardTitle}>SNAKI</Text>
            <Text style={styles.shareCardSubtitle}>
              {isNewBest ? "NEW HIGH SCORE!" : "GAME OVER"}
            </Text>
            <View style={styles.shareScoreBox}>
              <Text style={styles.shareScoreLabel}>SCORE</Text>
              <Text style={styles.shareScoreValue}>{score}</Text>
            </View>
            {isNewBest && (
              <Text style={styles.shareNewBest}>
                {"\u{1F3C6}"} Personal Best!
              </Text>
            )}
            <Text style={styles.shareFooter}>
              Can you beat me? {"\u{1F40D}"} Play Snaki!
            </Text>
          </View>
        </ViewShot>
      </View>
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
    marginBottom: 16,
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
    letterSpacing: 2,
  },
  // Hidden share card
  shareCardWrapper: {
    position: "absolute",
    left: -9999,
    top: -9999,
  },
  shareCard: {
    width: 360,
    padding: 32,
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  shareCardTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: 8,
    marginBottom: 4,
  },
  shareCardSubtitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 3,
    marginBottom: 20,
  },
  shareScoreBox: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    marginBottom: 12,
  },
  shareScoreLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.background,
    letterSpacing: 2,
    marginBottom: 2,
  },
  shareScoreValue: {
    fontSize: 48,
    fontWeight: "900",
    color: Colors.background,
  },
  shareNewBest: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.accent,
    marginBottom: 12,
  },
  shareFooter: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textDim,
    marginTop: 8,
  },
  // XP section
  xpSection: {
    width: "100%",
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  xpLevelText: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: 2,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textDim,
  },
  xpBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accent,
    marginTop: 6,
    textAlign: "center",
  },
  // Achievements
  achievementSection: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS - 4,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  achievementText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.white,
  },
  achievementBadge: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.accent,
    letterSpacing: 1,
  },
  // Combo compare
  comboCompareCard: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS - 4,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  comboCompareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  comboCompareLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 1,
  },
  comboCompareValue: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: 1,
  },
  // Challenge progress
  challengeSection: {
    width: "100%",
    marginBottom: 12,
    gap: 4,
  },
  challengeSectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 2,
    marginBottom: 4,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  challengeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.white,
  },
  challengeXp: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.primary,
  },
  xpBreakdownSection: {
    width: "100%",
    marginBottom: 12,
    gap: 4,
  },
  // Next skin hint
  nextSkinHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  nextSkinDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  nextSkinText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textDim,
  },
});

export default GameOverModal;
