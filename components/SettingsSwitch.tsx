import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import { settings_Vibration } from "@/lib/settings";
import { HapticFeedback } from "@/lib/haptics";

interface SettingsSwitchProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => Promise<void> | void;
  disabled?: boolean;
  testID?: string;
}

const TRACK_W = 52;
const TRACK_H = 30;
const THUMB_SIZE = 24;
const THUMB_TRAVEL = TRACK_W - THUMB_SIZE - 6; // 6 = padding (3 each side)

export default function SettingsSwitch({
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  testID,
}: SettingsSwitchProps) {
  const thumbX = useRef(new Animated.Value(value ? THUMB_TRAVEL : 0)).current;
  const trackColor = useRef(new Animated.Value(value ? 1 : 0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const thumbScale = useRef(new Animated.Value(1)).current;
  const shadowOffset = useRef(
    new Animated.Value(BLOCK_SHADOW_OFFSET / 2),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(thumbX, {
        toValue: value ? THUMB_TRAVEL : 0,
        tension: 300,
        friction: 15,
        useNativeDriver: true,
      }),
      Animated.timing(trackColor, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const bgInterpolation = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.surfaceLight, Colors.primaryDark],
  });

  const thumbBgInterpolation = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.textDim, Colors.primary],
  });

  const thumbShadowInterpolation = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0.3)", "rgba(107,127,94,0.5)"],
  });

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(pressScale, {
        toValue: 0.95,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(thumbScale, {
        toValue: 1.15,
        tension: 400,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOffset, {
        toValue: 1,
        duration: 60,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(thumbScale, {
        toValue: 1,
        tension: 300,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOffset, {
        toValue: BLOCK_SHADOW_OFFSET / 2,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePress = async () => {
    if (disabled) return;
    if (settings_Vibration()) {
      await HapticFeedback(value ? "light" : "medium");
    }
    await onValueChange(!value);
  };

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <Pressable
        style={[styles.container, disabled && styles.disabledContainer]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
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

        {/* Toggle track */}
        <View style={styles.toggleWrap}>
          {/* Shadow layer */}
          <Animated.View style={[styles.trackShadow, { top: shadowOffset }]} />
          {/* Track */}
          <Animated.View
            style={[styles.track, { backgroundColor: bgInterpolation }]}
          >
            {/* Thumb shadow */}
            <Animated.View
              style={[
                styles.thumbShadow,
                {
                  transform: [{ translateX: thumbX }, { scale: thumbScale }],
                  backgroundColor: thumbShadowInterpolation,
                },
              ]}
            />
            {/* Thumb */}
            <Animated.View
              style={[
                styles.thumb,
                {
                  transform: [{ translateX: thumbX }, { scale: thumbScale }],
                  backgroundColor: thumbBgInterpolation,
                },
              ]}
            >
              {/* Inner dot indicator */}
              <Animated.View
                style={[
                  styles.thumbDot,
                  {
                    opacity: trackColor,
                    backgroundColor: Colors.background,
                  },
                ]}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
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
    opacity: 0.4,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
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

  // Toggle
  toggleWrap: {
    width: TRACK_W,
    height: TRACK_H + BLOCK_SHADOW_OFFSET / 2,
    justifyContent: "flex-start",
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  trackShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  thumbShadow: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    top: 3,
    left: 3,
    zIndex: 1,
  },
  thumbDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
