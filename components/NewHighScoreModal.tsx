import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import Modal from "react-native-modal";
import { Colors, BLOCK_RADIUS, BLOCK_SHADOW_OFFSET } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";

interface NewHighScoreModalProps {
  visible: boolean;
  score: number;
  onContinue: () => void;
}

const { width } = Dimensions.get("window");

const NewHighScoreModal: React.FC<NewHighScoreModalProps> = ({
  visible,
  score,
  onContinue,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const starRotate = useRef(new Animated.Value(0)).current;
  const scoreCount = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!visible) return;
    scaleAnim.setValue(0);
    starRotate.setValue(0);
    scoreCount.setValue(0);
    glowPulse.setValue(0.4);

    // Entrance bounce
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Star spin
    Animated.loop(
      Animated.timing(starRotate, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Score count-up
    Animated.timing(scoreCount, {
      toValue: score,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [visible]);

  const spin = starRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      backdropOpacity={0.9}
      style={styles.modal}
    >
      <Animated.View
        style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Star icon spinning */}
        <Animated.View
          style={[
            styles.starContainer,
            { transform: [{ rotate: spin }], opacity: glowPulse },
          ]}
        >
          <Ionicons name="star" size={80} color={Colors.accent} />
        </Animated.View>

        {/* Crown */}
        <View style={styles.crownRow}>
          <Ionicons name="trophy" size={48} color={Colors.accent} />
        </View>

        {/* Title */}
        <Text style={styles.title}>NEW HIGH{"\n"}SCORE!</Text>

        {/* Animated score */}
        <View style={styles.scoreBox}>
          <View
            style={[
              styles.scoreBoxShadow,
              { backgroundColor: Colors.accentDark },
            ]}
          />
          <View style={styles.scoreBoxInner}>
            <AnimatedScore value={scoreCount} />
          </View>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>You just crushed it!</Text>

        {/* Continue button */}
        <View style={styles.buttonWrapper}>
          <View
            style={[
              styles.buttonShadow,
              { backgroundColor: Colors.primaryDark },
            ]}
          />
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>CONTINUE</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={Colors.background}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

// Animated score number
const AnimatedScore: React.FC<{ value: Animated.Value }> = ({ value }) => {
  const [display, setDisplay] = React.useState(0);
  useEffect(() => {
    const id = value.addListener(({ value: v }) => setDisplay(Math.round(v)));
    return () => value.removeListener(id);
  }, [value]);
  return <Text style={styles.scoreValue}>{display}</Text>;
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.78,
    padding: 32,
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BLOCK_RADIUS,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  starContainer: {
    position: "absolute",
    top: -40,
  },
  crownRow: {
    marginBottom: 12,
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: Colors.accent,
    letterSpacing: 4,
    textAlign: "center",
    lineHeight: 44,
    marginBottom: 20,
    textShadowColor: Colors.accentDark,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  scoreBox: {
    width: "100%",
    position: "relative",
    marginBottom: 16,
  },
  scoreBoxShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    borderRadius: BLOCK_RADIUS,
  },
  scoreBoxInner: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.accent,
    borderRadius: BLOCK_RADIUS,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: "900",
    color: Colors.background,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textDim,
    marginBottom: 24,
    letterSpacing: 1,
  },
  buttonWrapper: {
    width: "100%",
    position: "relative",
  },
  buttonShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BLOCK_SHADOW_OFFSET,
    bottom: -BLOCK_SHADOW_OFFSET,
    borderRadius: BLOCK_RADIUS,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BLOCK_RADIUS,
    width: "100%",
  },
  continueText: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.background,
    letterSpacing: 3,
  },
});

export default NewHighScoreModal;
