import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";

const GameOverModal = ({ isModalVisible, toggleModal, reloadGame }) => {
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal} // Close on backdrop press
      animationIn="bounceIn"       // Stylish animation on entry
      animationOut="fadeOut"       // Smooth fade-out
    >
      <LinearGradient
        colors={["#1a1a1a", "#000000"]}
        style={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Game Over</Text>
        <Text style={styles.modalMessage}>You have hit a wall!</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.exitButton} onPress={() => BackHandler.exitApp()}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playAgainButton} onPress={reloadGame}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  exitButton: {
    backgroundColor: "#ff5555",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  exitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  playAgainButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  playAgainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default GameOverModal;
