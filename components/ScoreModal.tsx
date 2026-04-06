import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useScoreStore } from "@/lib/scoreStore";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";

interface ScoreModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get("window");

export default function ScoreModal({
  isVisible,
  onClose,
}: ScoreModalProps): JSX.Element {
  const { highScore, scores } = useScoreStore();

  const renderScoreItem = ({
    item,
    index,
  }: {
    item: { score: number; date: string };
    index: number;
  }) => (
    <View style={styles.scoreItem}>
      <Text style={styles.scoreRank}>#{index + 1}</Text>
      <View style={styles.scoreDetails}>
        <Text style={styles.scoreValue}>{item.score}</Text>
        <Text style={styles.scoreDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.title}>HIGH SCORES</Text>
          </View>

          {/* Best score block */}
          <View style={styles.bestBlock}>
            <View style={[styles.bestBlockShadow]} />
            <View style={styles.bestBlockInner}>
              <Text style={styles.bestLabel}>BEST</Text>
              <Text style={styles.bestValue}>{highScore}</Text>
            </View>
          </View>

          <FlatList
            data={scores}
            renderItem={renderScoreItem}
            keyExtractor={(item) => item.date}
            style={styles.scoreList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No scores yet. Start playing!
              </Text>
            }
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BLOCK_RADIUS,
    borderTopRightRadius: BLOCK_RADIUS,
    padding: 20,
    paddingTop: 10,
    maxHeight: "80%",
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    borderBottomWidth: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  trophyIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.accent,
    letterSpacing: 3,
  },
  bestBlock: {
    position: "relative",
    marginBottom: 20,
  },
  bestBlockShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    backgroundColor: Colors.accentDark,
    borderRadius: BLOCK_RADIUS,
  },
  bestBlockInner: {
    alignItems: "center",
    padding: 16,
    borderRadius: BLOCK_RADIUS,
    backgroundColor: Colors.accent,
  },
  bestLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.background,
    letterSpacing: 2,
    marginBottom: 4,
  },
  bestValue: {
    fontSize: 40,
    fontWeight: "900",
    color: Colors.background,
  },
  scoreList: {
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: Colors.surface,
    borderRadius: BLOCK_RADIUS - 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  scoreRank: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.accent,
    width: 40,
    letterSpacing: 1,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.white,
  },
  scoreDate: {
    fontSize: 11,
    color: Colors.textDim,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: BLOCK_RADIUS - 4,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.textDim,
    fontSize: 15,
    marginTop: 20,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
