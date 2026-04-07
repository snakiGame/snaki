import React, { useEffect, useRef, useCallback } from "react";
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
import { useAudioPlayer } from "expo-audio";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const SNAKE_CELL = 16;
const SNAKE_AREA_W = Math.min(SCREEN_W * 0.7, 280);
const SNAKE_AREA_H = 120;

// ─── Notifications ─────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Animated Background ───────────────────────────────────────
const AnimatedGrid: React.FC = React.memo(() => {
  const opacity = useRef(new Animated.Value(0.15)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.15,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(drift, {
        toValue: -40,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const lines: React.ReactElement[] = [];
  const spacing = 40;
  const lineCount = Math.ceil(SCREEN_H / spacing) + 2;
  for (let i = 0; i < lineCount; i++) {
    lines.push(
      <View
        key={`h-${i}`}
        style={[styles.gridLine, { top: i * spacing, width: "100%" }]}
      />,
    );
  }
  const colCount = Math.ceil(SCREEN_W / spacing) + 1;
  for (let i = 0; i < colCount; i++) {
    lines.push(
      <View
        key={`v-${i}`}
        style={[styles.gridLineV, { left: i * spacing, height: "120%" }]}
      />,
    );
  }

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { opacity, transform: [{ translateY: drift }] },
      ]}
    >
      {lines}
    </Animated.View>
  );
});

// ─── Idle Snake (Bigger, More Alive) ───────────────────────────
const IdleSnake: React.FC = React.memo(() => {
  const moveX = useRef(new Animated.Value(0)).current;
  const moveY = useRef(new Animated.Value(0)).current;
  const foodScale = useRef(new Animated.Value(1)).current;
  const foodOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveX, {
          toValue: 60,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(moveY, {
          toValue: 20,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(moveX, {
          toValue: 100,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        // "eat" — food pop + vanish
        Animated.parallel([
          Animated.timing(moveX, {
            toValue: 130,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(foodScale, {
              toValue: 1.4,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(foodScale, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(moveY, {
          toValue: -10,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(moveX, {
          toValue: 40,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(moveY, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        // food respawn
        Animated.parallel([
          Animated.timing(moveX, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(foodOpacity, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(foodScale, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.delay(200),
            Animated.timing(foodOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(foodScale, {
              toValue: 1,
              duration: 200,
              easing: Easing.out(Easing.back(2)),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),
    ).start();
  }, []);

  const segments = [
    { dx: 0, dy: 0 },
    { dx: -SNAKE_CELL, dy: 0 },
    { dx: -SNAKE_CELL * 2, dy: 0 },
    { dx: -SNAKE_CELL * 3, dy: 0 },
    { dx: -SNAKE_CELL * 3, dy: -SNAKE_CELL },
    { dx: -SNAKE_CELL * 3, dy: -SNAKE_CELL * 2 },
    { dx: -SNAKE_CELL * 2, dy: -SNAKE_CELL * 2 },
  ];

  return (
    <View style={styles.idleScene}>
      <Animated.View
        style={[
          styles.idleSnakeWrap,
          { transform: [{ translateX: moveX }, { translateY: moveY }] },
        ]}
      >
        {segments.map((seg, i) => (
          <View
            key={i}
            style={[
              styles.idleSeg,
              {
                left: seg.dx + SNAKE_CELL * 4,
                top: seg.dy + SNAKE_CELL * 3,
                backgroundColor: i === 0 ? Colors.primary : Colors.primaryDark,
                opacity: 1 - i * 0.1,
              },
            ]}
          >
            <View style={styles.idleSegShadow} />
            {i === 0 && <View style={styles.idleEye} />}
          </View>
        ))}
      </Animated.View>

      <Animated.View
        style={[
          styles.idleFood,
          {
            left: SNAKE_CELL * 4 + 130,
            top: SNAKE_CELL * 3 - 2,
            opacity: foodOpacity,
            transform: [{ scale: foodScale }],
          },
        ]}
      >
        <View style={styles.idleFoodShadow} />
        <View style={styles.idleFoodBlock} />
      </Animated.View>
    </View>
  );
});

// ─── Play Button (Physical Feel) ──────────────────────────────
const PlayButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const pickSound = useAudioPlayer(require("../assets/music/pick.mp3"));
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(BLOCK_SHADOW_OFFSET)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.93,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.06,
          tension: 300,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: BLOCK_SHADOW_OFFSET,
          duration: 100,
          useNativeDriver: false,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    try {
      pickSound.seekTo(0);
      pickSound.play();
    } catch {}
    onPress();
  };

  return (
    <Animated.View
      style={{
        transform: [
          {
            scale: Animated.multiply(scaleAnim, pulseAnim),
          },
        ],
      }}
    >
      <Animated.View
        style={[
          styles.playBtnShadow,
          {
            top: shadowAnim,
            bottom: Animated.multiply(shadowAnim, -1),
          },
        ]}
      />
      <TouchableOpacity
        style={styles.playBtn}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Ionicons
          name="play"
          size={30}
          color={Colors.background}
          style={{ marginRight: 10 }}
        />
        <Text style={styles.playBtnText}>PLAY</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────
const HomePage: React.FC = () => {
  const router = useRouter();
  const { settingsInit } = useSettingStore();
  const { highScore, scores } = useScoreStore();

  const titleJitter = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.9)).current;

  const lastScore = scores.length > 0 ? scores[0].score : null;

  useEffect(() => {
    settingsInit();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
    scheduleDailyNotification();
  }, []);

  // Title entrance + periodic jitter
  useEffect(() => {
    Animated.spring(titleScale, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(titleJitter, {
          toValue: 3,
          duration: 80,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(titleJitter, {
          toValue: -2,
          duration: 60,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(titleJitter, {
          toValue: 0,
          duration: 70,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(titleJitter, {
          toValue: -3,
          duration: 60,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(titleJitter, {
          toValue: 1,
          duration: 80,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(titleJitter, {
          toValue: 0,
          duration: 60,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(5000),
      ]),
    ).start();
  }, []);

  const navigateToPlay = useCallback(() => {
    router.push("/play");
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <AnimatedGrid />

      <View style={styles.content}>
        {/* Title */}
        <Animated.View
          style={[
            styles.titleWrap,
            {
              transform: [{ scale: titleScale }, { translateX: titleJitter }],
            },
          ]}
        >
          <Text style={styles.titleShadow}>SNAKI</Text>
          <Text style={styles.title}>SNAKI</Text>
        </Animated.View>

        {/* Snake scene */}
        <IdleSnake />

        {/* Play */}
        <PlayButton onPress={navigateToPlay} />

        {/* Stats */}
        <View style={styles.statsRow}>
          {lastScore !== null && (
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>LAST</Text>
              <Text style={styles.statValue}>{lastScore}</Text>
            </View>
          )}
          {highScore > 0 && (
            <View style={[styles.statBlock, styles.statBlockAccent]}>
              <Text style={[styles.statLabel, styles.statLabelDark]}>BEST</Text>
              <Text style={[styles.statValue, styles.statValueDark]}>
                {highScore}
              </Text>
            </View>
          )}
          {scores.length > 1 && (
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>GAMES</Text>
              <Text style={styles.statValue}>{scores.length}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom icons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-sharp" size={20} color={Colors.textDim} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => router.push("/about")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={Colors.textDim}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── Notification helpers ─────────────────────────────────────
async function scheduleDailyNotification() {
  try {
    const existing = await Notifications.getAllScheduledNotificationsAsync();
    if (existing.some((n) => n.identifier === "daily-snaki-reminder")) return;
    await Notifications.scheduleNotificationAsync({
      identifier: "daily-snaki-reminder",
      content: {
        title: "Play Snaki \u{1F40D}",
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
  } catch {}
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
    } catch {}
  }
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  // Grid
  gridLine: {
    position: "absolute",
    height: 1,
    backgroundColor: Colors.surfaceLight,
  },
  gridLineV: {
    position: "absolute",
    width: 1,
    backgroundColor: Colors.surfaceLight,
  },

  // Title
  titleWrap: {
    position: "relative",
    marginBottom: 8,
  },
  title: {
    fontSize: 82,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: 12,
  },
  titleShadow: {
    position: "absolute",
    fontSize: 82,
    fontWeight: "900",
    color: Colors.primaryDark,
    letterSpacing: 12,
    left: 5,
    top: 6,
  },

  // Idle Snake
  idleScene: {
    width: SNAKE_AREA_W,
    height: SNAKE_AREA_H,
    marginBottom: 32,
    marginTop: 8,
    position: "relative",
    overflow: "hidden",
    borderRadius: BLOCK_RADIUS,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    backgroundColor: Colors.surface,
  },
  idleSnakeWrap: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  idleSeg: {
    position: "absolute",
    width: SNAKE_CELL - 2,
    height: SNAKE_CELL - 2,
    borderRadius: 3,
  },
  idleSegShadow: {
    position: "absolute",
    left: 1,
    top: 2,
    right: -1,
    bottom: -2,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 3,
    zIndex: -1,
  },
  idleEye: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.background,
  },
  idleFood: {
    position: "absolute",
    width: SNAKE_CELL - 2,
    height: SNAKE_CELL - 2,
  },
  idleFoodBlock: {
    width: SNAKE_CELL - 2,
    height: SNAKE_CELL - 2,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    zIndex: 2,
  },
  idleFoodShadow: {
    position: "absolute",
    left: 1,
    top: 2,
    right: -1,
    bottom: -2,
    borderRadius: 3,
    backgroundColor: Colors.accentDark,
    zIndex: 1,
  },

  // Play Button
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 72,
    borderRadius: BLOCK_RADIUS,
    zIndex: 2,
  },
  playBtnShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: Colors.primaryDark,
    borderRadius: BLOCK_RADIUS,
    zIndex: 1,
  },
  playBtnText: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 6,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 28,
  },
  statBlock: {
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: BLOCK_RADIUS - 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    minWidth: 72,
  },
  statBlockAccent: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accentDark,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textDim,
    letterSpacing: 2,
    marginBottom: 2,
  },
  statLabelDark: {
    color: Colors.background,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.white,
  },
  statValueDark: {
    color: Colors.background,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingBottom: Platform.OS === "ios" ? 4 : 12,
    paddingTop: 8,
  },
  bottomBtn: {
    width: 40,
    height: 40,
    borderRadius: BLOCK_RADIUS,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
});

export default HomePage;
