import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import useSettingStore from "@/lib/settings";
import { useScoreStore } from "@/lib/scoreStore";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W } = Dimensions.get("window");
const GRID_SIZE = 20;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Animated block character for the idle scene
const IdleSnake: React.FC = () => {
  const moveX = useRef(new Animated.Value(0)).current;
  const moveY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Idle patrol: move right, down, left, up — subtle loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveX, {
          toValue: 30,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(moveY, {
          toValue: 15,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(moveX, {
          toValue: -10,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(moveY, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(moveX, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const segments = [
    { offsetX: 0, offsetY: 0, isHead: true },
    { offsetX: -GRID_SIZE, offsetY: 0, isHead: false },
    { offsetX: -GRID_SIZE * 2, offsetY: 0, isHead: false },
    { offsetX: -GRID_SIZE * 2, offsetY: -GRID_SIZE, isHead: false },
  ];

  return (
    <Animated.View
      style={[
        styles.idleSnakeContainer,
        { transform: [{ translateX: moveX }, { translateY: moveY }] },
      ]}
    >
      {segments.map((seg, i) => (
        <View
          key={i}
          style={[
            styles.idleSegment,
            {
              left: seg.offsetX,
              top: seg.offsetY,
              backgroundColor: i === 0 ? Colors.primary : Colors.primaryDark,
              opacity: 1 - i * 0.15,
            },
          ]}
        >
          {seg.isHead && <View style={styles.idleEye} />}
        </View>
      ))}
      {/* Idle food nearby */}
      <View style={[styles.idleFood, { left: GRID_SIZE * 2.5, top: -2 }]} />
    </Animated.View>
  );
};

// Pulsing play button
const PlayButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      {/* Block shadow layer */}
      <View style={styles.playButtonShadow} />
      <TouchableOpacity
        style={styles.playButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons
          name="play"
          size={28}
          color={Colors.background}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.playButtonText}>PLAY</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Grid background dots
const GridBackground: React.FC = () => {
  const dots = [];
  const cols = Math.floor(SCREEN_W / 40);
  const rows = 20;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <View
          key={`${r}-${c}`}
          style={[styles.gridDot, { left: c * 40 + 20, top: r * 40 + 20 }]}
        />,
      );
    }
  }
  return <View style={StyleSheet.absoluteFill}>{dots}</View>;
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const { settingsInit } = useSettingStore();
  const { highScore, scores } = useScoreStore();

  const titleBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    settingsInit();
  }, []);

  // Notification setup
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {});
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => {});

    scheduleDailyNotification();

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // Title bounce
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleBounce, {
          toValue: -8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleBounce, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <GridBackground />

      <View style={styles.content}>
        {/* Settings gear — top right */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-sharp" size={22} color={Colors.textDim} />
        </TouchableOpacity>

        {/* Title */}
        <Animated.Text
          style={[styles.title, { transform: [{ translateY: titleBounce }] }]}
        >
          SNAKI
        </Animated.Text>
        <Text style={styles.subtitle}>Classic snake game reimagined</Text>

        {/* Idle snake scene */}
        <View style={styles.idleScene}>
          <IdleSnake />
        </View>

        {/* Play CTA */}
        <PlayButton onPress={() => router.push("/play")} />

        {/* Best score block */}
        {highScore > 0 && (
          <View style={styles.bestScoreBlock}>
            <View style={styles.bestScoreShadow} />
            <View style={styles.bestScoreInner}>
              <Text style={styles.bestScoreLabel}>BEST</Text>
              <Text style={styles.bestScoreValue}>{highScore}</Text>
            </View>
          </View>
        )}

        {/* Games played */}
        {scores.length > 0 && (
          <Text style={styles.gamesPlayed}>{scores.length} games played</Text>
        )}

        {/* About link */}
        <TouchableOpacity
          style={styles.aboutButton}
          onPress={() => router.push("/about")}
          activeOpacity={0.7}
        >
          <Text style={styles.aboutButtonText}>Credits</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

async function scheduleDailyNotification() {
  try {
    const existingNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const hasScheduledNotification = existingNotifications.some(
      (notification) => notification.identifier === "daily-snaki-reminder",
    );

    if (!hasScheduledNotification) {
      await Notifications.scheduleNotificationAsync({
        identifier: "daily-snaki-reminder",
        content: {
          title: "Play Snaki 🐍",
          body: "Time to beat your high score!",
          data: { screen: "play" },
        },
        trigger: {
          type: "daily",
          hour: 8,
          minute: 0,
          repeats: true,
          channelId: "daily-reminders",
        } as Notifications.NotificationTriggerInput,
      });
    }
  } catch (e) {
    // silently fail on simulators
  }
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily-reminders", {
      name: "Daily Reminders",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return;
    try {
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
    } catch (e) {
      // ignore
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // Settings gear
  settingsButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 12 : 16,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: BLOCK_RADIUS,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },

  // Grid dots
  gridDot: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.surfaceLight,
    opacity: 0.3,
  },

  // Title
  title: {
    fontSize: 56,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: 8,
    textShadowColor: Colors.primaryDark,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 4,
    marginTop: 4,
    marginBottom: 32,
    textTransform: "uppercase",
  },

  // Idle snake scene
  idleScene: {
    width: 160,
    height: 80,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  idleSnakeContainer: {
    position: "relative",
    width: 120,
    height: 60,
  },
  idleSegment: {
    position: "absolute",
    width: GRID_SIZE - 2,
    height: GRID_SIZE - 2,
    borderRadius: 4,
  },
  idleEye: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.background,
  },
  idleFood: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
  },

  // Play button
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: BLOCK_RADIUS,
    zIndex: 2,
  },
  playButtonShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    backgroundColor: Colors.primaryDark,
    borderRadius: BLOCK_RADIUS,
    zIndex: 1,
  },
  playButtonText: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 4,
  },

  // Best score
  bestScoreBlock: {
    marginTop: 28,
    position: "relative",
  },
  bestScoreShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    backgroundColor: Colors.accentDark,
    borderRadius: BLOCK_RADIUS,
  },
  bestScoreInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: BLOCK_RADIUS,
    gap: 12,
  },
  bestScoreLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.background,
    letterSpacing: 2,
  },
  bestScoreValue: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.background,
  },

  gamesPlayed: {
    marginTop: 16,
    fontSize: 13,
    color: Colors.textDim,
    letterSpacing: 1,
  },

  // About
  aboutButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  aboutButtonText: {
    fontSize: 14,
    color: Colors.textDim,
    letterSpacing: 1,
    textDecorationLine: "underline",
  },
});

export default HomePage;
