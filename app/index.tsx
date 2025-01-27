import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/src/styles/colors";
import useSettingStore, { settings_isRondedEdges } from "@/lib/settings";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const HomePage: React.FC = () => {
  const router = useRouter();
  const bounceAnim = new Animated.Value(0);
  const { settingsInit, settings } = useSettingStore();

  useEffect(() => {
    settingsInit();
  }, []);
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token),
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification clicked:", response);
      });
    if (!settings.isNotificationSet) {
      scheduleDailyNotification(); // Schedules the daily notification on load if not loaded yet
    }

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(bounceAnim, {
        toValue: 20,
        duration: 2000,
        easing: Easing.sin,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <LinearGradient colors={["#ffffff", "#f2f8f9","#d8e9d8"]} style={styles.container}>
      <SafeAreaView style={styles.content}>
        <StatusBar style="dark" backgroundColor={Colors.primary} />
        <Animated.Image
          source={require("../assets/icon.png")}
          style={[styles.logo, { transform: [{ translateY: bounceAnim }] }]}
        />
        <Text style={styles.title}>Welcome to Snaki!</Text>
        <Text style={styles.subtitle}>The Classic Snake Game Reimagined</Text>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push("/play")}
        >
          <Text style={styles.playButtonText}>Play Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.creditsButton}
          onPress={() => router.push("/about")}
        >
          <Text style={styles.creditsButtonText}>Credits</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

async function scheduleDailyNotification() {
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
        body: "It's time to play Snaki! Improve your skills and climb the leaderboard!",
        data: { screen: "play" },
      },
      trigger: {
        // seconds:5
        hour: 8, // 8:00 AM
        minute: 0,
        repeats: true,
      },
    });
    console.log("Daily notification scheduled!");
  } else {
    console.log("Notification already scheduled.");
  }
}

async function registerForPushNotificationsAsync() {
  let token;

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
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notifications!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    ).data;
    console.log("Push token:", token);
  } else {
    alert("Must use a physical device for push notifications.");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 38,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 20,
    color: "#555555",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "300",
    letterSpacing: 1,
  },
  playButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: settings_isRondedEdges()?10:0,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  playButtonText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  creditsButton: {
    backgroundColor: Colors.accents,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: settings_isRondedEdges()?10:0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  creditsButtonText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomePage;
