import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface Settings {
  theme: string;
  vibration: boolean;
  backgroundMusic: boolean;
  roundEdges: boolean;
  isNotificationSet: boolean;
}

interface SettingStore {
  settings: Settings;
  settingsInit: () => Promise<void>;
  updateSetting: (
    key: keyof Settings,
    value: Settings[keyof Settings],
  ) => Promise<void>;
}

// Default settings function
const defaultSettings = (): Settings => ({
  theme: "light",
  vibration: true,
  backgroundMusic: true,
  roundEdges: false,
  isNotificationSet: false,
});

const useSettingStore = create<SettingStore>((set) => ({
  settings: defaultSettings(),

  settingsInit: async () => {
    try {
      const storedSettings = await AsyncStorage.getItem("settings");
      if (storedSettings) {
        set({ settings: JSON.parse(storedSettings) }); // Loads from AsyncStorage
      } else {
        const defaults = defaultSettings();
        await AsyncStorage.setItem("settings", JSON.stringify(defaults)); // Saves defaults
        set({ settings: defaults });
      }
    } catch (error) {
      console.error("Error initializing settings:", error);
    }
  },

  // Updates a specific setting and persist it in AsyncStorage
  updateSetting: async (key, value) => {
    set((state) => {
      const updatedSettings = { ...state.settings, [key]: value };
      AsyncStorage.setItem("settings", JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },
}));

// Utility functions to access specific settings
export function settings_backgroundMusic(): boolean {
  const { settings } = useSettingStore.getState();
  return settings.backgroundMusic; // Returns a boolean
}

export function settings_Vibration(): boolean {
  const { settings } = useSettingStore.getState();
  return settings.vibration; // Returns a boolean
}

export default useSettingStore;
