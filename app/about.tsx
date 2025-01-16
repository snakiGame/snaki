import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/src/styles/colors';

export default function About() {
  return (
    <LinearGradient
      colors={['#f0f0f0', '#ffffff']} 
      style={styles.container}
    >

        <StatusBar barStyle="dark-content" backgroundColor="#000" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile and Title Section */}
        <View style={styles.profileContainer}>
          <Image source={require('../assets/me.jpg')} style={styles.profileImage} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Tachera Sasi</Text>
            <Text style={styles.subtitle}>CEO of ekilie | Tech Innovator | Developer</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.aboutText}>
            Tachera Sasi, a visionary developer from Tanzania, is the driving force behind several innovative projects, including "ekilie," an office management solution, and "ekiliRelay," an email API service. Tachera's passion for coding, combined with expertise in JavaScript, React, Node.js, and Django, empowers him to create impactful digital products.
          </Text>

          <Text style={styles.aboutText}>
            As the CEO of ekilie, Tachera's mission is to build solutions that not only enhance productivity but also address real-world challenges. His projects cover web development, mobile apps, and scalable cloud services, enabling businesses and individuals to thrive.
          </Text>
        </View>

        {/* Inspirational Quote */}
        <View style={styles.inspirationalContainer}>
          <Text style={styles.inspirationalText}>
            "Success is not just about solving problems, but about pushing the boundaries of innovation and creativity. Keep dreaming, keep building, and make your mark."
          </Text>
          <Text style={styles.signature}>— Tachera Sasi</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Tachera Sasi. All rights reserved.</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#333333', // Darker border for sharper contrast
    borderWidth: 3,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#222222', // Deep black text for bold contrast
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#555555', // Medium gray for softer contrast
    fontStyle: 'italic',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Shadow for Android
  },
  aboutText: {
    fontSize: 16,
    color: '#333333', // Dark text for readability
    marginBottom: 15,
    lineHeight: 24,
  },
  inspirationalContainer: {
    marginTop: 30,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderColor: '#222222', // Bold left border for inspirational quote
    marginBottom: 50,
  },
  inspirationalText: {
    fontSize: 20,
    color: '#222222', // Strong black for emphasis
    fontStyle: 'italic',
    lineHeight: 30,
    marginBottom: 10,
  },
  signature: {
    fontSize: 16,
    color: '#555555', // Lighter gray for signature
    textAlign: 'right',
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888888', // Light gray footer for subtle contrast
  },
});
