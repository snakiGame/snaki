import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../styles/colors';
import { settings_isRondedEdges } from '@/lib/settings';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ScoreModalProps {
  isVisible: boolean;
  onClose: () => void;
  highScore: number;
}

const { width } = Dimensions.get('window');

export default function ScoreModal({ isVisible, onClose, highScore }: ScoreModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
    >
      <View style={styles.container}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Ionicons name="trophy" size={32} color="#fff" />
          <Text style={styles.title}>High Score</Text>
        </View>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.scoreContainer}
        >
          <Text style={styles.scoreLabel}>Best Score</Text>
          <Text style={styles.scoreValue}>{highScore}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.statText}>Keep going!</Text>
            </View>
          </View>
        </LinearGradient>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: settings_isRondedEdges() ? 25 : 0,
    borderTopRightRadius: settings_isRondedEdges() ? 25 : 0,
    padding: 25,
    paddingBottom: 40,
    width: width,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
  },
  statsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  statText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});