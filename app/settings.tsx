import { ScrollView, StyleSheet, Platform } from "react-native";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useSettingStore from "@/lib/settings";
import { stopBackgroundMusic, backgroundMusic } from "@/lib/utils";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import SettingsSwitch from "@/components/SettingsSwitch";

export default function Settings() {
  const router = useRouter();
  const { settings, updateSetting } = useSettingStore();
  const [soundEnabled, setSoundEnabled] = useState(settings.backgroundMusic);
  const [vibrationEnabled, setVibrationEnabled] = useState(settings.vibration);
  const [roundedEdges, setRoundedEdges] = useState(settings.roundEdges);
  const [theme, setTheme] = useState(settings.theme);

  // Sync local state with store
  useEffect(() => {
    setSoundEnabled(settings.backgroundMusic);
    setVibrationEnabled(settings.vibration);
    setTheme(settings.theme);
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
            await updateSetting("theme", "light");
            await updateSetting("vibration", true);
            await updateSetting("backgroundMusic", true);
            setSoundEnabled(true);
            setVibrationEnabled(true);
            setTheme("light");
            // Start background music since it's being reset to enabled
            await backgroundMusic(true);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={["#f0f0f0", "#ffffff"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar style="dark" backgroundColor="#f0f0f0" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Make Snaki suit your every whim!</Text>
        </View>

        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.optionContainer}>
          {/* Background Music */}
          <View style={styles.section}>
            <SettingsSwitch
              title="Background Music"
              description="Enable background music while playing"
              value={soundEnabled}
              onValueChange={async () => {
                const newValue = !settings.backgroundMusic;
                await updateSetting("backgroundMusic", newValue);
                setSoundEnabled((prev) => !prev);

                if (newValue) {
                  // Start background music when enabled (force play since setting just changed)
                  await backgroundMusic(true);
                } else {
                  // Stop background music when disabled
                  await stopBackgroundMusic();
                }
              }}
              testID="background-music-switch"
            />
          </View>

          {/* Vibration */}
          <View style={[styles.section, styles.lastSection]}>
            <SettingsSwitch
              title="Vibration"
              description="Enable haptic feedback during gameplay"
              value={vibrationEnabled}
              onValueChange={async () => {
                await updateSetting("vibration", !settings.vibration);
                setVibrationEnabled((prev) => !prev);
              }}
              testID="vibration-switch"
            />
          </View>
        </View>

        {/* Theme Settings */}
        <Text style={styles.sectionHeader}>Appearance</Text>
        <View style={styles.optionContainer}>
          <View style={styles.section}>
            <SettingsSwitch
              title="Rounded Edges"
              description="Switch between sharp and rounded edges in the app UI"
              value={roundedEdges}
              onValueChange={async () => {
                await updateSetting("roundEdges", !settings.roundEdges);
                setRoundedEdges((prev) => !prev);
              }}
              testID="rounded-edges-switch"
            />
          </View>
          <View style={styles.section}>
            <SettingsSwitch
              title="Dark Theme"
              description="Switch between Light and Dark mode (Coming Soon)"
              value={theme === "dark"}
              onValueChange={async () => {
                const newTheme = theme === "light" ? "dark" : "light";
                await updateSetting("theme", newTheme);
                setTheme(newTheme);
              }}
              disabled={true} // for now will enable this in a much later version
              testID="theme-switch"
            />
          </View>
        </View>

        {/* Reset Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
            <Text style={styles.resetButtonText}>Reset to Default</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Snaki. Slithering into your hearts, one game at a time.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222222",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#555555",
    marginTop: 5,
    textAlign: "center",
    fontStyle: "italic",
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222222",
    marginTop: 30,
    marginBottom: 15,
  },
  optionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#e63946",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 50,
    marginBottom: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
  },
});
