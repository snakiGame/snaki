import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string; // Ionicons name
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_game", title: "First Steps", description: "Play your first game", icon: "footsteps" },
  { id: "score_10", title: "Getting Started", description: "Score 10 points", icon: "star-outline" },
  { id: "score_50", title: "Half Century", description: "Score 50 points", icon: "star-half" },
  { id: "score_100", title: "Triple Digits", description: "Score 100 points", icon: "star" },
  { id: "score_200", title: "Snake Lord", description: "Score 200 points", icon: "trophy" },
  { id: "combo_3", title: "Combo!", description: "Get a 3x combo", icon: "flame-outline" },
  { id: "combo_5", title: "On Fire", description: "Max out the combo multiplier", icon: "flame" },
  { id: "games_10", title: "Dedicated", description: "Play 10 games", icon: "game-controller-outline" },
  { id: "games_50", title: "Addicted", description: "Play 50 games", icon: "game-controller" },
  { id: "golden_eat", title: "Gold Digger", description: "Eat a golden food", icon: "diamond-outline" },
  { id: "rainbow_eat", title: "Taste the Rainbow", description: "Eat a rainbow food", icon: "color-palette" },
  { id: "poison_survive", title: "Survivor", description: "Eat poison and keep playing", icon: "skull-outline" },
  { id: "streak_3", title: "On a Roll", description: "3-day challenge streak", icon: "calendar" },
  { id: "streak_7", title: "Weeklong Warrior", description: "7-day challenge streak", icon: "ribbon" },
  { id: "level_5", title: "Leveling Up", description: "Reach level 5", icon: "arrow-up-circle" },
  { id: "all_skins", title: "Fashionista", description: "Unlock all skins", icon: "shirt" },
];

interface AchievementState {
  unlocked: string[]; // Array of achievement IDs
  newlyUnlocked: string[]; // Not yet seen by user
  unlock: (id: string) => void;
  markSeen: () => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlocked: [],
      newlyUnlocked: [],

      unlock: (id: string) => {
        const state = get();
        if (state.unlocked.includes(id)) return;
        set({
          unlocked: [...state.unlocked, id],
          newlyUnlocked: [...state.newlyUnlocked, id],
        });
      },

      markSeen: () => set({ newlyUnlocked: [] }),
    }),
    {
      name: "achievement-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
