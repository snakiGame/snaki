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

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <>
    <Text style={styles.sectionLabel}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </>
);

interface ItemRowProps {
  color: string;
  label: string;
  desc: string;
}

const ItemRow: React.FC<ItemRowProps> = ({ color, label, desc }) => (
  <View style={styles.itemRow}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <View style={styles.itemText}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemDesc}>{desc}</Text>
    </View>
  </View>
);

export default function HowToPlay() {
  const router = useRouter();

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
          <Text style={styles.title}>HOW TO PLAY</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Controls */}
        <Section title="CONTROLS">
          <View style={styles.swipeDemo}>
            <View style={styles.swipeArrow}>
              <Ionicons name="arrow-up" size={24} color={Colors.white} />
            </View>
            <View style={styles.swipeRow}>
              <View style={styles.swipeArrow}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </View>
              <View style={styles.swipeCenter}>
                <Ionicons
                  name="hand-left-outline"
                  size={28}
                  color={Colors.textDim}
                />
              </View>
              <View style={styles.swipeArrow}>
                <Ionicons name="arrow-forward" size={24} color={Colors.white} />
              </View>
            </View>
            <View style={styles.swipeArrow}>
              <Ionicons name="arrow-down" size={24} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.controlHint}>
            Swipe anywhere on screen to change direction
          </Text>
        </Section>

        {/* Food Types */}
        <Section title="FOOD TYPES">
          <ItemRow
            color={Colors.accent}
            label="Normal"
            desc="+1 point, grows snake"
          />
          <View style={styles.divider} />
          <ItemRow
            color={Colors.accent}
            label="Golden"
            desc="+3 points, grows snake"
          />
          <View style={styles.divider} />
          <ItemRow
            color="#c084fc"
            label="Rainbow"
            desc="+5 points, grows snake"
          />
          <View style={styles.divider} />
          <ItemRow
            color={Colors.danger}
            label="Poison"
            desc="-5 points, shrinks snake"
          />
        </Section>

        {/* Power-Ups */}
        <Section title="POWER-UPS">
          <ItemRow
            color={Colors.primary}
            label="Speed"
            desc="1.5x movement speed for 5s"
          />
          <View style={styles.divider} />
          <ItemRow
            color="#60a5fa"
            label="Slow"
            desc="0.7x movement speed for 5s"
          />
          <View style={styles.divider} />
          <ItemRow
            color={Colors.accent}
            label="2X Points"
            desc="Double score for 5s"
          />
        </Section>

        {/* Combo System */}
        <Section title="COMBO SYSTEM">
          <Text style={styles.comboText}>
            Eat food quickly (within 2 seconds) to build combos.
          </Text>
          <View style={styles.comboBadges}>
            {[
              { combo: "3x", color: Colors.accent, label: "Unlocks" },
              { combo: "5x", color: "#ff8c00", label: "Max multi" },
            ].map((item) => (
              <View
                key={item.combo}
                style={[styles.comboBadge, { borderColor: item.color }]}
              >
                <Text style={[styles.comboValue, { color: item.color }]}>
                  {item.combo}
                </Text>
                <Text style={styles.comboLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.comboHint}>Eating poison resets your combo!</Text>
        </Section>

        {/* Game Over */}
        <Section title="GAME OVER">
          <Text style={styles.comboText}>
            The game ends when the snake hits a wall or its own body. Try to
            beat your high score!
          </Text>
        </Section>

        <Text style={styles.footer}>Now go get that high score!</Text>
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 3,
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceLight,
    marginVertical: 10,
  },

  // Controls
  swipeDemo: {
    alignItems: "center",
    gap: 4,
    marginVertical: 8,
  },
  swipeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  swipeArrow: {
    width: 44,
    height: 44,
    borderRadius: BLOCK_RADIUS - 4,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeCenter: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  controlHint: {
    fontSize: 13,
    color: Colors.textDim,
    textAlign: "center",
    marginTop: 12,
  },

  // Item rows
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },
  itemDesc: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 1,
  },

  // Combo
  comboText: {
    fontSize: 13,
    color: Colors.textDim,
    lineHeight: 20,
  },
  comboBadges: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    justifyContent: "center",
  },
  comboBadge: {
    borderWidth: 2,
    borderRadius: BLOCK_RADIUS - 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  comboValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  comboLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textDim,
    letterSpacing: 1,
    marginTop: 2,
  },
  comboHint: {
    fontSize: 12,
    color: Colors.danger,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },

  footer: {
    marginTop: 32,
    fontSize: 12,
    color: Colors.textDim,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
});
