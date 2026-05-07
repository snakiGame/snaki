import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import { useDailyChallengeStore, xpForLevel } from "@/lib/challengeStore";

export default function Challenges() {
  const router = useRouter();
  const {
    challenges,
    definitions,
    streak,
    xp,
    level,
    refreshIfNeeded,
    claimReward,
  } = useDailyChallengeStore();

  useEffect(() => {
    refreshIfNeeded();
  }, []);

  const xpNeeded = xpForLevel(level);
  const xpProgress = xpNeeded > 0 ? Math.min(xp / xpNeeded, 1) : 0;
  const allDone = challenges.length > 0 && challenges.every((c) => c.completed);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>DAILY</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Level + XP bar */}
        <View style={styles.levelCard}>
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>LEVEL {level}</Text>
            <Text style={styles.xpText}>
              {xp} / {xpNeeded} XP
            </Text>
          </View>
          <View style={styles.xpBarBg}>
            <View
              style={[styles.xpBarFill, { width: `${xpProgress * 100}%` }]}
            />
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <Ionicons name="flame" size={24} color={Colors.accent} />
          <View>
            <Text style={styles.streakValue}>{streak} days</Text>
            <Text style={styles.streakLabel}>STREAK</Text>
          </View>
          {allDone && (
            <View style={styles.allDoneBadge}>
              <Text style={styles.allDoneText}>ALL DONE!</Text>
            </View>
          )}
        </View>

        {/* Challenge cards */}
        <Text style={styles.sectionLabel}>TODAY'S CHALLENGES</Text>
        {challenges.map((c) => {
          const def = definitions.find((d) => d.id === c.challengeId);
          if (!def) return null;

          const progress = Math.min(c.current / def.target, 1);

          return (
            <View key={c.challengeId} style={styles.challengeCard}>
              <View style={styles.challengeTop}>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeTitle}>{def.title}</Text>
                  <Text style={styles.challengeDesc}>{def.description}</Text>
                </View>
                <Text style={styles.challengeXp}>+{def.xpReward}</Text>
              </View>

              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progress * 100}%`,
                      backgroundColor: c.completed
                        ? Colors.primary
                        : Colors.surfaceLight,
                    },
                  ]}
                />
              </View>

              <View style={styles.challengeBottom}>
                <Text style={styles.progressText}>
                  {c.current}/{def.target}
                </Text>
                {c.completed && !c.claimed && (
                  <TouchableOpacity
                    style={styles.claimBtn}
                    onPress={() => claimReward(c.challengeId)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.claimBtnText}>CLAIM</Text>
                  </TouchableOpacity>
                )}
                {c.claimed && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.primary}
                  />
                )}
              </View>
            </View>
          );
        })}

        <Text style={styles.hint}>Challenges reset daily at midnight</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BLOCK_RADIUS,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: 4,
  },
  // Level
  levelCard: {
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: 3,
  },
  xpText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textDim,
  },
  xpBarBg: {
    height: 10,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 5,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  // Streak
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    marginBottom: 20,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.white,
  },
  streakLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 2,
  },
  allDoneBadge: {
    marginLeft: "auto",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  allDoneText: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 3,
    marginBottom: 10,
    marginLeft: 4,
  },
  // Challenge card
  challengeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    marginBottom: 10,
  },
  challengeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 12,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },
  challengeDesc: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 2,
  },
  challengeXp: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  challengeBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textDim,
  },
  claimBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
  },
  claimBtnText: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 1,
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: Colors.textDim,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
