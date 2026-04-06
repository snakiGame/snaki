import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import { useRouter } from "expo-router";

export default function About() {
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
          <Text style={styles.headerTitle}>ABOUT</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* App identity */}
        <View style={styles.identityRow}>
          <Image
            source={require("../assets/icon.png")}
            style={styles.appIcon}
          />
          <View style={styles.identityText}>
            <Text style={styles.appName}>SNAKI</Text>
            <Text style={styles.tagline}>Snake, but make it spicy</Text>
          </View>
        </View>

        {/* Link buttons */}
        <View style={styles.linksRow}>
          <TouchableOpacity
            style={styles.linkBlock}
            onPress={() =>
              Linking.openURL("https://github.com/snakiGame/snaki")
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.linkShadow,
                { backgroundColor: Colors.surfaceLight },
              ]}
            />
            <View style={styles.linkInner}>
              <Ionicons name="logo-github" size={20} color={Colors.white} />
              <Text style={styles.linkText}>GitHub</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBlock}
            onPress={() =>
              Linking.openURL("https://buymeacoffee.com/xjwsjbtyfd")
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.linkShadow,
                { backgroundColor: Colors.accentDark },
              ]}
            />
            <View
              style={[styles.linkInner, { backgroundColor: Colors.accent }]}
            >
              <Ionicons
                name="cafe-outline"
                size={20}
                color={Colors.background}
              />
              <Text style={[styles.linkText, { color: Colors.background }]}>
                Buy Coffee
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About card */}
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Hey there! I'm Tachera Sasi — you can call me Tach — the
            troublemaker behind Snaki. It's the classic snake game you know and
            love, just cooler. Like, sunglasses cool.
          </Text>
          <Text style={styles.cardText}>
            Snaki's all about dodging walls, eating snacks, and pretending
            you're more strategic than you actually are. I made it because,
            well, why not?
          </Text>
          <View style={styles.warningBlock}>
            <Text style={styles.warningLabel}>WARNING</Text>
            <Text style={styles.warningText}>
              Side effects include fun, frustration, and shouting "Just one more
              game!"
            </Text>
          </View>
        </View>

        {/* Quote */}
        <View style={styles.quoteBlock}>
          <View style={styles.quoteLine} />
          <View style={styles.quoteContent}>
            <Text style={styles.quoteText}>
              "If you're not growing, you're just a snake hitting walls."
            </Text>
            <Text style={styles.quoteAuthor}>
              — Me, probably while procrastinating
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {"\u00A9"} 2025 Tachera Sasi. Built with code, snacks, and
          questionable life choices.
        </Text>
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
    paddingBottom: 40,
  },

  // Header
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: 4,
  },

  // Identity
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: BLOCK_RADIUS,
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  identityText: {
    flex: 1,
  },
  appName: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: 6,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textDim,
    marginTop: 2,
    fontStyle: "italic",
  },

  // Links
  linksRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  linkBlock: {
    flex: 1,
    position: "relative",
  },
  linkShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    borderRadius: BLOCK_RADIUS,
  },
  linkInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: BLOCK_RADIUS,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    marginBottom: 24,
  },
  cardText: {
    fontSize: 15,
    color: Colors.white,
    lineHeight: 24,
    marginBottom: 14,
  },
  warningBlock: {
    backgroundColor: Colors.danger,
    borderRadius: BLOCK_RADIUS - 4,
    padding: 12,
    marginTop: 4,
  },
  warningLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: 3,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
  },

  // Quote
  quoteBlock: {
    flexDirection: "row",
    marginBottom: 32,
  },
  quoteLine: {
    width: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginRight: 14,
  },
  quoteContent: {
    flex: 1,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    color: Colors.white,
    lineHeight: 28,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: Colors.textDim,
  },

  footer: {
    fontSize: 12,
    color: Colors.textDim,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
