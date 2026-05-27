import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const DAILY_REMINDER_ID = "daily-snaki-reminder";

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return false;

    try {
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
    } catch {
      // Best effort: local scheduling still works without token in many cases.
    }
    return true;
  }

  return false;
}

async function ensureAndroidChannel() {
  await Notifications.setNotificationChannelAsync("daily-reminders", {
    name: "Daily Reminders",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

export async function setDailyReminderEnabled(enabled: boolean) {
  if (enabled) {
    if (Platform.OS === "android") {
      await ensureAndroidChannel();
    }

    const granted = await registerForPushNotificationsAsync();
    if (!granted) return;

    const existing = await Notifications.getAllScheduledNotificationsAsync();
    const alreadyScheduled = existing.some(
      (n) => n.identifier === DAILY_REMINDER_ID,
    );

    if (!alreadyScheduled) {
      await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_ID,
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

    return;
  }

  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of existing) {
    if (notification.identifier === DAILY_REMINDER_ID) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }
}
