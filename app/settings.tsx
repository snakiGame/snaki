import { ScrollView, StyleSheet } from "react-native";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Make Snaki suit your every whim!</Text>
        </View>
      </SafeAreaView>

      <Text style={styles.sectionHeader}>Preferences</Text>
      <View style={styles.optionContainer}>
        <View style={styles.section}>
          <Text style={styles.settingTitle}>Game Sound</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Enable sound effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={() => setSoundEnabled((prev) => !prev)}
              thumbColor={soundEnabled ? "#a9b8a9" : "#f4f4f4"}
              trackColor={{ false: "#d8d8d8", true: "#cfe0cf" }}
            />
          </View>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.settingTitle}>Vibration</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Enable vibrations</Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={() => setVibrationEnabled((prev) => !prev)}
              thumbColor={vibrationEnabled ? "#a9b8a9" : "#f4f4f4"}
              trackColor={{ false: "#d8d8d8", true: "#cfe0cf" }}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 Snaki Inc. Slithering into your hearts, one game at a time.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 15,
  },
  optionContainer: {
    backgroundColor: "#f2f8f2",
    borderRadius: 12,
    borderColor: "#d8e9d8",
    borderWidth: 1,
    padding: 10,
    elevation: 2,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#d8e9d8",
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingText: {
    fontSize: 16,
    color: "#555",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
