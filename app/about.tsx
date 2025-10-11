import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/styles/colors";

export default function About() {
  return (
    <LinearGradient colors={["#f0f0f0", "#ffffff"]} style={styles.container}>
      <StatusBar style="light" backgroundColor="#000" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile and Title Section */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/icon.png")}
            style={styles.profileImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Snaki</Text>
            <Text style={styles.subtitle}>Snake, but make it spicy</Text>
          </View>
        </View>
        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          {/* GitHub Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Linking.openURL("https://github.com/snakiGame/snaki")
            }
          >
            <Ionicons
              name="logo-github"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>GitHub</Text>
          </TouchableOpacity>

          {/* Buy Me a Coffee Button */}
          <TouchableOpacity
            style={[styles.button, styles.coffeeButton]}
            onPress={() =>
              Linking.openURL("https://buymeacoffee.com/xjwsjbtyfd")
            }
          >
            <Ionicons
              name="cafe-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Buy Me a Coffee</Text>
          </TouchableOpacity>
        </View>
        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.aboutText}>
            Hey there! I’m Tachera Sasi, you can call me Tach, the troublemaker behind Snaki.  
            It's the classic snake game you know and love just cooler.  
            Like, sunglasses cool.  
          </Text>


          <Text style={styles.aboutText}>
            Snaki’s all about dodging walls, eating snacks, and pretending
            you’re more strategic than you actually are. I made it because,
            well, why not? And also because snakes deserve a comeback.
          </Text>

          <Text style={styles.aboutText}>
            <Text style={{ backgroundColor: "#f1948a", padding: 3 }}>
              Warning:
            </Text>{" "}
            Side effects include fun, frustration, and shouting, "Just one more
            game!"
          </Text>
        </View>

        {/* Inspirational Section */}
        <View style={styles.inspirationalContainer}>
          <Text style={styles.inspirationalText}>
            "If you’re not growing, you’re just a snake hitting walls."
          </Text>
          <Text style={styles.signature}>
            — Me, probably while procrastinating
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Tachera Sasi. Built with code, snacks, and questionable life
            choices.
          </Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  profileImage: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "#222222",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#555555",
    fontStyle: "italic",
  },
  detailsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  aboutText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 15,
    lineHeight: 24,
  },
  inspirationalContainer: {
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderColor: "#222222",
    marginBottom: 50,
  },
  inspirationalText: {
    fontSize: 20,
    color: "#222222",
    fontStyle: "italic",
    lineHeight: 30,
    marginBottom: 10,
  },
  signature: {
    fontSize: 16,
    color: "#555555",
    textAlign: "right",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  coffeeButton: {
    backgroundColor: Colors.accents,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 50,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#888888",
  },
});
