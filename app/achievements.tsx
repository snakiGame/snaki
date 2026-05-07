import React from "react";
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
import { Colors, BLOCK_RADIUS } from "@/styles/colors";
import { useAchievementStore, ACHIEVEMENTS } from "@/lib/achievementStore";

export default function Achievements() {
  const router = useRouter();
  const { unlocked } = useAchievementStore();

  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;

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
          <Text style={styles.title}>BADGES</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressCount}>
            {unlockedCount}/{totalCount}
          </Text>
          <Text style={styles.progressLabel}>UNLOCKED</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(unlockedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Achievements grid */}
        <View style={styles.grid}>
          {ACHIEVEMENTS.map((a) => {
            const isUnlocked = unlocked.includes(a.id);
            return (
              <View
                key={a.id}
                style={[
                  styles.achievementCard,
                  isUnlocked && styles.achievementCardUnlocked,
                ]}
              >
                <View
                  style={[
                    styles.iconCircle,
                    isUnlocked && styles.iconCircleUnlocked,
                  ]}
                >
                  <Ionicons
                    name={a.icon as any}
                    size={24}
                    color={isUnlocked ? Colors.background : Colors.textDim}
                  />
                </View>
                <Text
                  style={[
                    styles.achievementTitle,
                    !isUnlocked && styles.lockedText,
                  ]}
                >
                  {a.title}
                </Text>
                <Text
                  style={[
                    styles.achievementDesc,
                    !isUnlocked && styles.lockedText,
                  ]}
                >
                  {isUnlocked ? a.description : "???"}
                </Text>
              </View>
            );
          })}
        </View>
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
  // Progress
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    alignItems: "center",
    marginBottom: 20,
  },
  progressCount: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.accent,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 3,
    marginTop: 2,
    marginBottom: 12,
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  achievementCard: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    alignItems: "center",
    gap: 6,
    opacity: 0.5,
  },
  achievementCardUnlocked: {
    opacity: 1,
    borderColor: Colors.accent,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleUnlocked: {
    backgroundColor: Colors.accent,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.white,
    textAlign: "center",
    letterSpacing: 1,
  },
  achievementDesc: {
    fontSize: 11,
    color: Colors.textDim,
    textAlign: "center",
  },
  lockedText: {
    color: Colors.textDim,
  },
});
