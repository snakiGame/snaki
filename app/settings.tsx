import { ScrollView, StyleSheet, Platform } from "react-native";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useSettingStore from "@/lib/settings";
import { stopBackgroundMusic, backgroundMusic } from "@/lib/utils";
import { StatusBar } from "expo-status-bar";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import SettingsSwitch from "@/components/SettingsSwitch";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const router = useRouter();
  const { settings, updateSetting } = useSettingStore();
  const [soundEnabled, setSoundEnabled] = useState(settings.backgroundMusic);
  const [vibrationEnabled, setVibrationEnabled] = useState(settings.vibration);
  const [roundedEdges, setRoundedEdges] = useState(settings.roundEdges);

  useEffect(() => {
    setSoundEnabled(settings.backgroundMusic);
    setVibrationEnabled(settings.vibration);
  }, [settings]);

  const resetSettings = async () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: async () => {
            await updateSetting("vibration", true);
            await updateSetting("backgroundMusic", true);
            setSoundEnabled(true);
            setVibrationEnabled(true);
            await backgroundMusic(true);
          },
          style: "destructive",
        },
      ],
    );
  };

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
          <Text style={styles.title}>SETTINGS</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <SettingsSwitch
            title="Background Music"
            description="Ambient music while playing"
            value={soundEnabled}
            onValueChange={async () => {
              const newValue = !settings.backgroundMusic;
              await updateSetting("backgroundMusic", newValue);
              setSoundEnabled((prev) => !prev);
              if (newValue) {
                await backgroundMusic(true);
              } else {
                await stopBackgroundMusic();
              }
            }}
            testID="background-music-switch"
          />
          <View style={styles.divider} />
          <SettingsSwitch
            title="Vibration"
            description="Haptic feedback during gameplay"
            value={vibrationEnabled}
            onValueChange={async () => {
              await updateSetting("vibration", !settings.vibration);
              setVibrationEnabled((prev) => !prev);
            }}
            testID="vibration-switch"
          />
        </View>

        {/* Appearance */}
        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <View style={styles.card}>
          <SettingsSwitch
            title="Rounded Edges"
            description="Rounded vs sharp corners on game elements"
            value={roundedEdges}
            onValueChange={async () => {
              await updateSetting("roundEdges", !settings.roundEdges);
              setRoundedEdges((prev) => !prev);
            }}
            testID="rounded-edges-switch"
          />
        </View>

        {/* Reset */}
        <View style={styles.resetWrap}>
          <View style={styles.resetShadow} />
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={resetSettings}
            activeOpacity={0.8}
          >
            <Ionicons
              name="refresh"
              size={18}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.resetBtnText}>RESET TO DEFAULT</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {"\u00A9"} 2025 Snaki. Slithering into your hearts.
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
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
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
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: 4,
  },

  // Section
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
    marginVertical: 4,
  },

  // Reset
  resetWrap: {
    marginTop: 32,
    position: "relative",
    alignSelf: "center",
  },
  resetShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    backgroundColor: Colors.dangerDark,
    borderRadius: BLOCK_RADIUS,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.danger,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BLOCK_RADIUS,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: 2,
  },

  footer: {
    marginTop: 40,
    fontSize: 12,
    color: Colors.textDim,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
