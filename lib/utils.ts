import { createAudioPlayer, AudioPlayer } from "expo-audio";
import { settings_backgroundMusic } from "./settings";

let playerInstance: AudioPlayer | null = null;

export const backgroundMusic = async (forcePlay: boolean = false) => {
  // Checks if background music setting is enabled (unless forced)
  if (!forcePlay && !settings_backgroundMusic()) {
    return;
  }

  if (playerInstance) {
    return; //Not playing the audio twice while the other instance is still playing
  }
  try {
    const player = createAudioPlayer(
      require("../assets/music/bg-music1.mp3"),
    );
    player.loop = true;
    player.volume = 0.25;
    playerInstance = player;
    player.play();
  } catch (error) {
    console.error("Error playing background music:", error);
  }
};

export const stopBackgroundMusic = async () => {
  if (playerInstance) {
    try {
      playerInstance.pause();
      playerInstance.remove();
    } catch (error) {
      console.error("Error stopping background music:", error);
    } finally {
      playerInstance = null;
    }
  }
};
