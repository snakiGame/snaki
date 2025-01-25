import { Audio } from "expo-av";
import useSettingStore, { settings_backgroundMusic } from "./settings";


export let soundInstance: Audio.Sound | null = null; // NOTE:Tracks the sound instance globally 

export const backgroundMusic = async () => {
  // Checks if background music setting is enabled
  if (!settings_backgroundMusic()) {
    return;
  }

  if(soundInstance){
    return //Not playing the audio twice while the other instance is still playing
  }
  try {
    // Creates and load the sound
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/music/bg-music1.mp3"),
      { shouldPlay: true, isLooping: true }
    );

    // Keeps track of the sound instance for unmounting later
    soundInstance = sound;

    
    await sound.setVolumeAsync(0.25);
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing background music:", error);
  }
};


export const stopBackgroundMusic = async () => {
  if (soundInstance) {
    try {
      // Stops and unloads the sound
      await soundInstance.stopAsync();
      await soundInstance.unloadAsync();
    } catch (error) {
      console.error("Error stopping background music:", error);
    } finally {
      soundInstance = null; // Resetting the sound instance
    }
  }
};
