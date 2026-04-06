import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, BLOCK_RADIUS } from "../styles/colors";
import { FontAwesome } from "@expo/vector-icons";

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
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.button}
            onPress={reloadGame}
            activeOpacity={0.7}
          >
            <Ionicons name="reload" size={20} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={pauseGame}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={isPaused ? "play" : "pause"}
              size={18}
              color={Colors.white}
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
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.surfaceLight,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: BLOCK_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
});
