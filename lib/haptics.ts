import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";


/** * Types of haptic feedback available
 */
export type HapticFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error"
  | "selection";

export async function HapticFeedback(type: HapticFeedbackType = "light") {
  try {
    switch (type) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        break;
      case "warning":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
        break;
      case "error":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "selection":
        await Haptics.selectionAsync();
        break;
      default:
        await Haptics.selectionAsync();
        break;
    }
  } catch {
    // fallback for old Android or simulators
    if (Platform.OS === "android") {
      const vibrationMap: Record<HapticFeedbackType, number> = {
        light: 10,
        medium: 30,
        heavy: 50,
        success: 40,
        warning: 40,
        error: 60,
        selection: 10,
      };
      Vibration.vibrate(vibrationMap[type] ?? 20);
    }
  }
}
