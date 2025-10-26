import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/styles/colors";

interface SettingsSwitchProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => Promise<void> | void;
  disabled?: boolean;
  testID?: string;
}

export default function SettingsSwitch({
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  testID,
}: SettingsSwitchProps) {
  const handlePress = async () => {
    if (!disabled) {
      await onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabledContainer]}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.7}
      testID={testID}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, disabled && styles.disabledText]}>
          {title}
        </Text>
        <Text style={[styles.description, disabled && styles.disabledText]}>
          {description}
        </Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          thumbColor={disabled ? "#cccccc" : value ? Colors.primary : "#f4f4f4"}
          trackColor={{
            false: disabled ? "#e0e0e0" : "#d8d8d8",
            true: disabled ? "#b0b0b0" : "#81c784",
          }}
          style={styles.switch}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    minHeight: 70,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    flexWrap: "wrap",
  },
  disabledText: {
    color: "#999999",
  },
  switchContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});
