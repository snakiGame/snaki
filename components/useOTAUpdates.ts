import { useEffect } from "react";
import { AppState } from "react-native";
import * as Updates from "expo-updates";
import { toast } from "yooo-native";

/**
 * Silent OTA updates:
 * - Checks for updates when app comes to foreground
 * - Downloads silently in the background
 * - Applies automatically on next cold start (no user prompt)
 */
export function useOTAUpdates() {
  const { isUpdateAvailable } = Updates.useUpdates();

  // Check for updates when the app comes to the foreground
  useEffect(() => {
    if (__DEV__) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        Updates.checkForUpdateAsync().catch(() => {});
      }
    });

    return () => subscription.remove();
  }, []);

  // When an update is available, download it silently.
  // It will be applied automatically on the next app launch.
  useEffect(() => {
    if (isUpdateAvailable) {
      Updates.fetchUpdateAsync().catch(() => {});
      toast.info("Update downloaded. It will be applied on the next app launch.");
    }
  }, [isUpdateAvailable]);
}
