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
import useSettingStore from "@/lib/settings";
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

  //notification configs
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    [],
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token),
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? []),
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const { settingsInit,settings } = useSettingStore();

  const schedulenotification = async () => {
    if(settings.isNotificationSet){
      return
    }
    await schedulePushNotification();
  };
  useEffect(() => {
    schedulenotification();
    settingsInit();
  }, []);

  useEffect(() => {
    // Infinite smooth up-and-down animation
    // NOT working will fix this later
    Animated.loop(
      Animated.timing(bounceAnim, {
        toValue: 20, // Moving up by 20 units
        duration: 2000, // Duration for the upward movement
        easing: Easing.sin, // Using Easing from React Native
        useNativeDriver: true,
      }),
    ).start();

    // Returns to the original position after the upward movement
    Animated.loop(
      Animated.timing(bounceAnim, {
        toValue: -20, // Moving down by 20 units
        duration: 2000, // Same duration for downward movement
        easing: Easing.sin,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <LinearGradient colors={["#ffffff", "#f0f0f0"]} style={styles.container}>
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

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
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
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
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
    borderRadius: 0,
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
    borderRadius: 0,
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
