import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/styles/colors";

export interface SnakeSkin {
  id: string;
  name: string;
  head: string;
  body: string;
  unlockScore: number; // 0 = free
}

export const SNAKE_SKINS: SnakeSkin[] = [
  { id: "default", name: "Sage", head: Colors.primary, body: Colors.primaryDark, unlockScore: 0 },
  { id: "gold", name: "Gold", head: "#facc15", body: "#ca8a04", unlockScore: 0 },
  { id: "ice", name: "Ice", head: "#60a5fa", body: "#3b82f6", unlockScore: 10 },
  { id: "fire", name: "Fire", head: "#ef4444", body: "#b91c1c", unlockScore: 25 },
  { id: "grape", name: "Grape", head: "#c084fc", body: "#7c3aed", unlockScore: 50 },
  { id: "mint", name: "Mint", head: "#34d399", body: "#059669", unlockScore: 75 },
  { id: "sunset", name: "Sunset", head: "#fb923c", body: "#ea580c", unlockScore: 100 },
  { id: "neon", name: "Neon", head: "#22d3ee", body: "#0891b2", unlockScore: 150 },
  { id: "ghost", name: "Ghost", head: "#e2e8f0", body: "#94a3b8", unlockScore: 200 },
];

interface SkinState {
  selectedSkinId: string;
  selectSkin: (id: string) => void;
}

export const useSkinStore = create<SkinState>()(
  persist(
    (set) => ({
      selectedSkinId: "default",
      selectSkin: (id: string) => set({ selectedSkinId: id }),
    }),
    {
      name: "skin-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function getActiveSkin(): SnakeSkin {
  const { selectedSkinId } = useSkinStore.getState();
  return SNAKE_SKINS.find((s) => s.id === selectedSkinId) ?? SNAKE_SKINS[0];
}
