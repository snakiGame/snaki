import { TouchableOpacity, StyleSheet, View, Platform, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { settings_isRondedEdges } from "@/lib/settings";

interface HeaderProps {
  reloadGame: () => void;
  pauseGame: () => void;
  children: JSX.Element;
  isPaused: boolean;
}

export default function Header({
  children,
  reloadGame,
  pauseGame,
  isPaused,
}: HeaderProps): JSX.Element {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  
  const pauseGameThenPushToSettings = ()=>{
    pauseGame()
    router.push("/settings")
  }
  
  return (
    <View style={styles.container}>
      <View style={[styles.content, isSmallScreen && styles.smallScreenContent]}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.settings]}
            onPress={() => pauseGameThenPushToSettings()}
          >
            <Ionicons name="settings-sharp" size={isSmallScreen ? 20 : 24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.reload]}
            onPress={reloadGame}
          >
            <Ionicons name="reload-circle" size={isSmallScreen ? 20 : 24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.pause]}
            onPress={pauseGame}
          >
            <FontAwesome
              name={isPaused ? "play-circle" : "pause-circle"}
              size={isSmallScreen ? 20 : 24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: settings_isRondedEdges() ? 25 : 0,
    borderBottomRightRadius: settings_isRondedEdges() ? 25 : 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  smallScreenContent: {
    paddingHorizontal: 15,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settings: {
    backgroundColor: Colors.accents,
  },
  reload: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  pause: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
