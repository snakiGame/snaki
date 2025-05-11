import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useScoreStore } from '@/lib/scoreStore';
import { Colors } from '@/styles/colors';

interface ScoreModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function ScoreModal({ isVisible, onClose }: ScoreModalProps): JSX.Element {
  const { highScore, scores } = useScoreStore();

  const renderScoreItem = ({ item, index }: { item: { score: number; date: string }; index: number }) => (
    <LinearGradient
      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
      style={styles.scoreItem}
    >
      <Text style={styles.scoreRank}>#{index + 1}</Text>
      <View style={styles.scoreDetails}>
        <Text style={styles.scoreValue}>{item.score}</Text>
        <Text style={styles.scoreDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.modalContainer}>
        <LinearGradient
          colors={[Colors.primary, 'rgba(0,0,0,0.95)']}
          style={styles.modalContent}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <LinearGradient
              colors={[Colors.tertiary, '#FFD700']}
              style={styles.iconBackground}
            >
              <Ionicons name="trophy" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>High Scores</Text>
          </View>

          <LinearGradient
            colors={['rgba(234,179,8,0.2)', 'rgba(234,179,8,0.05)']}
            style={styles.highScoreContainer}
          >
            <Text style={styles.highScoreLabel}>Best Score</Text>
            <Text style={styles.highScoreValue}>{highScore}</Text>
          </LinearGradient>

          <FlatList
            data={scores}
            renderItem={renderScoreItem}
            keyExtractor={(item) => item.date}
            style={styles.scoreList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No scores yet. Start playing!</Text>
            }
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 10,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginLeft: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  highScoreLabel: {
    fontSize: 16,
    color: Colors.tertiary,
    marginBottom: 5,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highScoreValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.tertiary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  scoreList: {
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  scoreRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.tertiary,
    width: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  emptyText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
