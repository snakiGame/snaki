import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
  
  const pauseGameThemPushToSettings = ()=>{//Pauses the game the pushs to settings page
    pauseGame()
    router.replace("/settings")
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.settings}
          onPress={() => pauseGameThemPushToSettings()}
        >
          <Ionicons name="settings-sharp" size={35} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={reloadGame}>
          <Ionicons name="reload-circle" size={35} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={pauseGame}>
          <FontAwesome
            name={isPaused ? "play-circle" : "pause-circle"}
            size={35}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.08,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: Colors.primary,
    borderWidth: 12,
    // borderRadius: 30,
    borderBottomWidth: 0,
    padding: 15,
    backgroundColor: Colors.background,
  },
  controls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  settings: {
    backgroundColor: Colors.accents,
    borderRadius: 10,
    padding: 2,
  },
});
