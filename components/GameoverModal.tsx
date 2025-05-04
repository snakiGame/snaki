import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Vibration,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/styles/colors";
import useSettingStore, { settings_isRondedEdges } from "@/lib/settings";
import { Ionicons } from "@expo/vector-icons";

interface GameoverModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  reloadGame: () => void;
  score: number;
  highScore: number;
}

const { width } = Dimensions.get('window');

const GameOverModal = ({
  isModalVisible,
  toggleModal,
  reloadGame,
  score,
  highScore,
}: GameoverModalProps) => {
  const { settings } = useSettingStore();
  return (
    <Modal
      isVisible={isModalVisible}
      animationIn="wobble"
      animationOut="zoomOut"
      backdropTransitionOutTiming={0}
      style={styles.modal}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.primary + 'CC']}
        style={styles.modalContainer}
      >
        <View style={styles.header}>
          <Ionicons name="game-controller" size={40} color="#fff" />
          <Text style={styles.modalTitle}>Game Over</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Best</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
          </View>
        </View>

        <Image
          source={require("../assets/crash.png")} 
          style={styles.crashImage}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={() => {
            if(settings.vibration) Vibration.vibrate(15);
            toggleModal();
            reloadGame();
          }}
        >
          <Ionicons name="refresh" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.playAgainButtonText}>Play Again</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    padding: 25,
    alignItems: "center",
    borderRadius: settings_isRondedEdges() ? 25 : 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    minWidth: 100,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  crashImage: {
    width: 120,
    height: 120,
    marginBottom: 25,
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  playAgainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default GameOverModal;
