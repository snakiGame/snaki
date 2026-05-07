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
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import { SNAKE_SKINS, useSkinStore } from "@/lib/skinStore";
import { useScoreStore } from "@/lib/scoreStore";

export default function Skins() {
  const router = useRouter();
  const { highScore } = useScoreStore();
  const { selectedSkinId, selectSkin } = useSkinStore();

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
          <Text style={styles.title}>SKINS</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Skins grid */}
        <View style={styles.grid}>
          {SNAKE_SKINS.map((skin) => {
            const isSelected = skin.id === selectedSkinId;
            const isLocked = highScore < skin.unlockScore;

            return (
              <TouchableOpacity
                key={skin.id}
                style={[
                  styles.skinCard,
                  isSelected && styles.skinCardSelected,
                  isLocked && styles.skinCardLocked,
                ]}
                onPress={() => {
                  if (!isLocked) selectSkin(skin.id);
                }}
                activeOpacity={isLocked ? 1 : 0.7}
              >
                {/* Snake preview */}
                <View style={styles.preview}>
                  {[0, 1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.previewSeg,
                        {
                          backgroundColor: i === 0 ? skin.head : skin.body,
                          opacity: isLocked ? 0.3 : Math.max(0.5, 1 - i * 0.15),
                          left: i * 14,
                        },
                      ]}
                    >
                      <View style={styles.previewSegShadow} />
                    </View>
                  ))}
                </View>

                {/* Name */}
                <Text
                  style={[
                    styles.skinName,
                    isSelected && styles.skinNameSelected,
                    isLocked && styles.skinNameLocked,
                  ]}
                >
                  {skin.name}
                </Text>

                {/* Status badge */}
                {isLocked ? (
                  <View style={styles.lockBadge}>
                    <Ionicons
                      name="lock-closed"
                      size={10}
                      color={Colors.textDim}
                    />
                    <Text style={styles.lockText}>{skin.unlockScore}</Text>
                  </View>
                ) : isSelected ? (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>ACTIVE</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Hint */}
        <Text style={styles.hint}>Reach a high score to unlock new skins</Text>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 16,
  },
  skinCard: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    alignItems: "center",
    gap: 10,
  },
  skinCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#252534",
  },
  skinCardLocked: {
    opacity: 0.6,
  },
  preview: {
    width: 70,
    height: 20,
    position: "relative",
  },
  previewSeg: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 3,
    top: 2,
  },
  previewSegShadow: {
    position: "absolute",
    left: 1,
    top: 2,
    right: -1,
    bottom: -2,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 3,
    zIndex: -1,
  },
  skinName: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 2,
  },
  skinNameSelected: {
    color: Colors.primary,
  },
  skinNameLocked: {
    color: Colors.textDim,
  },
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lockText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textDim,
  },
  activeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeText: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 1,
  },
  hint: {
    marginTop: 24,
    fontSize: 12,
    color: Colors.textDim,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
