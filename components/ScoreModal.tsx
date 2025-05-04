import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useScoreStore } from '@/lib/scoreStore';

interface ScoreModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function ScoreModal({ isVisible, onClose }: ScoreModalProps): JSX.Element {
  const { highScore, scores } = useScoreStore();

  const renderScoreItem = ({ item, index }: { item: { score: number; date: string }; index: number }) => (
    <View style={styles.scoreItem}>
      <Text style={styles.scoreRank}>#{index + 1}</Text>
      <View style={styles.scoreDetails}>
        <Text style={styles.scoreValue}>{item.score}</Text>
        <Text style={styles.scoreDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </View>
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
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
          style={styles.modalContent}
        >
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <Text style={styles.title}>High Scores</Text>
          </View>

          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreLabel}>Best Score</Text>
            <Text style={styles.highScoreValue}>{highScore}</Text>
          </View>

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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    maxHeight: '80%',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  highScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 15,
  },
  highScoreLabel: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 5,
  },
  highScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  scoreList: {
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 10,
  },
  scoreRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    width: 40,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
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
  },
  emptyText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    marginTop: 20,
  },
});