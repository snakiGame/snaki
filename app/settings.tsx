import { ScrollView, StyleSheet, Platform } from "react-native";
import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useSettingStore from "@/lib/settings";
import { stopBackgroundMusic } from "@/lib/utils";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/styles/colors";
import { LinearGradient } from "expo-linear-gradient";

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
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" backgroundColor={Colors.primary} />
      <ScrollView 
        style={styles.container}
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
            <Text style={styles.settingTitle}>Background Music</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Enable background music</Text>
              <Switch
                value={soundEnabled}
                onValueChange={async () => {
                  await updateSetting(
                    "backgroundMusic",
                    !settings.backgroundMusic,
                  );
                  setSoundEnabled((prev) => !prev);
                  stopBackgroundMusic();
                }}
                thumbColor={soundEnabled ? "#a9b8a9" : "#f4f4f4"}
                trackColor={{ false: "#d8d8d8", true: "#cfe0cf" }}
              />
            </View>
          </View>

          {/* Vibration */}
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.settingTitle}>Vibration</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Enable vibrations</Text>
              <Switch
                value={vibrationEnabled}
                onValueChange={async () => {
                  await updateSetting("vibration", !settings.vibration);
                  setVibrationEnabled((prev) => !prev);
                }}
                thumbColor={vibrationEnabled ? "#a9b8a9" : "#f4f4f4"}
                trackColor={{ false: "#d8d8d8", true: "#cfe0cf" }}
              />
            </View>
          </View>
        </View>

        {/* Theme Settings */}
        <Text style={styles.sectionHeader}>Appearance</Text>
        <View style={styles.optionContainer}>
          <View style={styles.section}>
            <Text style={styles.settingTitle}>Rounded edges</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>
                Switch between sharp and rounded edges in the app ui
              </Text>
              <Switch
                value={roundedEdges}
                onValueChange={async () => {
                  await updateSetting("roundEdges", !settings.roundEdges);
                  setRoundedEdges((prev) => !prev);
                }}
                thumbColor={theme === "dark" ? "#a9b8a9" : "#f4f4f4"}
                trackColor={{ false: "#d8d8d8", true: "#cfe0cf" }}
              />
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.settingTitle}>Theme</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>
                Switch between Light and Dark mode
              </Text>
              <Switch
                disabled //for now will enable this in a much later version
                value={theme === "dark"}
                onValueChange={async () => {
                  const newTheme = theme === "light" ? "dark" : "light";
                  await updateSetting("theme", newTheme);
                  setTheme(newTheme);
                }}
                thumbColor={theme === "dark" ? "#a9b8a9" : "#f4f4f4"}
                trackColor={{ false: "#d8d8d8", true: "#cfe0cf" }}
              />
            </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
    marginVertical: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  optionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    padding: 10,
    elevation: 2,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#e63946",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  resetButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    marginTop: 30,
    marginBottom: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});
