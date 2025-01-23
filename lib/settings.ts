import { create } from "zustand";

const useSettingStore = create((set) => ({
  settings: {
    theme: "light",
    vibration:true,
    backgroundMusic:true
  },
}));

export function settings_backgroundMusic() {
  //returns a boolean
  return false;
}

export function settings_Vibration() {
  //returns a boolean
  return false;
}
