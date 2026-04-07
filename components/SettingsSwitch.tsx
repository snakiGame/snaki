import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/styles/colors";
import { settings_Vibration } from "@/lib/settings";

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
  const triggerHaptic = async () => {
    if (settings_Vibration()) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePress = async () => {
    if (!disabled) {
      // Provide haptic feedback for switch interaction
      await triggerHaptic();
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
          onValueChange={async (newValue) => {
            if (!disabled) {
              // Provide haptic feedback when switch is toggled directly
              await triggerHaptic();
              await onValueChange(newValue);
            }
          }}
          disabled={disabled}
          thumbColor={
            disabled ? Colors.textDim : value ? Colors.primary : Colors.white
          }
          trackColor={{
            false: disabled ? Colors.surfaceLight : Colors.surfaceLight,
            true: disabled ? Colors.surfaceLight : Colors.primaryDark,
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
    fontSize: 16,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: Colors.textDim,
    lineHeight: 20,
    flexWrap: "wrap",
  },
  disabledText: {
    color: Colors.surfaceLight,
  },
  switchContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});
