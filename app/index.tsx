import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/src/styles/colors'; // Assuming this is your custom color file

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#ffffff', '#f0f0f0']} // Light gradient background for depth
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
        
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        
        <Text style={styles.title}>Welcome to Snaki!</Text>
        <Text style={styles.subtitle}>The Classic Snake Game Reimagined</Text>
        
        <TouchableOpacity style={styles.playButton} onPress={() => router.push('/play')}>
          <Text style={styles.playButtonText}>Play Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.creditsButton} onPress={() => router.push('/about')}>
          <Text style={styles.creditsButtonText}>Credits</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
    resizeMode: 'contain', // Keep the logo aspect ratio
  },
  title: {
    fontSize: 38,
    color: '#000000', // Black text for high contrast
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1.5, // Add some spacing for elegance
  },
  subtitle: {
    fontSize: 20,
    color: '#555555', // Gray text for subtle contrast
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '300',
    letterSpacing: 1, // Consistent with the title
  },
  playButton: {
    backgroundColor: '#1a1a1a', // Darker button for play
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 0,
    marginBottom: 20,
    shadowColor: '#000', // Add shadow for better visual depth
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10, // For Android shadow
  },
  playButtonText: {
    fontSize: 20,
    color: '#ffffff', // White text for contrast
    fontWeight: 'bold',
    textAlign: 'center',
  },
  creditsButton: {
    backgroundColor: '#a9b8a9', // Bright color for credits
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 0,
    shadowColor: '#000', // Add shadow for better visual depth
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10, // For Android shadow
  },
  creditsButtonText: {
    fontSize: 20,
    color: '#000000', // Black text for contrast
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomePage;
