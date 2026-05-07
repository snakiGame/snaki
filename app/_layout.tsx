import { SplashScreen } from "expo-router";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Toaster } from "yooo-native";
import { useOTAUpdates } from "@/components/useOTAUpdates";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useOTAUpdates();

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="play" />
        <Stack.Screen name="about" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="skins" />
        <Stack.Screen name="howtoplay" />
        <Stack.Screen name="challenges" />
        <Stack.Screen name="achievements" />
      </Stack>
      <Toaster />
    </>
  );
}
