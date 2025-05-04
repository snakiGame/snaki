import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Image,
  Vibration,
} from "react-native";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/styles/colors";
import useSettingStore, { settings_isRondedEdges } from "@/lib/settings";

interface GameoverModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  reloadGame: () => void;
}

const GameOverModal = ({
  isModalVisible,
  toggleModal,
  reloadGame,
}: GameoverModalProps) => {
  const { settings } = useSettingStore();
  return (
    <Modal
      isVisible={isModalVisible}
      // onBackdropPress={toggleModal}
      animationIn="shake"
      animationOut="wobble"
    >
      <LinearGradient
        colors={["#1a1a1a", "#000000"]}
        style={styles.modalContainer}
      >
        {/* Game Over Title */}
        <Text style={styles.modalTitle}>Game Over</Text>

        {/* Game Over Message */}
        <Text style={styles.modalMessage}>You have hit a wall!</Text>

        {/* Snake Crash Image */}
        <Image
          source={require("../assets/crash.png")} 
          style={styles.crashImage}
          resizeMode="contain"
        />

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Play Again Button */}
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={() => {
              if(settings.vibration){
                //mounting a tiny vibration if enabled
                Vibration.vibrate(15)
              }
              toggleModal();
              reloadGame();
            }}
          >
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    borderRadius: settings_isRondedEdges()?10:0
  },
  modalTitle: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    color: "#aaaaaa",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1.2,
  },
  crashImage: {
    width: 150, 
    height: 150, 
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  playAgainButton: {
    width: "100%",
    borderRadius: settings_isRondedEdges()?10:0,
    backgroundColor: Colors.accents,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  playAgainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default GameOverModal;
