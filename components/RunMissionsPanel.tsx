import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Colors, BLOCK_RADIUS } from "@/styles/colors";
import { RunMissionProgress } from "@/lib/runMissions";

interface RunMissionsPanelProps {
  missions: RunMissionProgress[];
}

const VISIBLE_DURATION = 2000;
const FADE_DURATION = 400;

const RunMissionsPanel: React.FC<RunMissionsPanelProps> = React.memo(
  ({ missions }) => {
    const opacity = useRef(new Animated.Value(1)).current;
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
      // Reset visibility when missions change (new game)
      opacity.setValue(1);
      setHidden(false);

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start(() => setHidden(true));
      }, VISIBLE_DURATION);

      return () => clearTimeout(timer);
    }, [missions]);

    if (!missions.length || hidden) return null;

    return (
      <Animated.View style={[styles.container, { opacity }]}>
        <Text style={styles.title}>RUN MISSIONS</Text>
        {missions.map((mission) => (
          <View key={mission.id} style={styles.row}>
            <Text style={[styles.dot, mission.completed && styles.dotDone]}>
              {mission.completed ? "✓" : "•"}
            </Text>
            <Text
              style={[styles.missionText, mission.completed && styles.doneText]}
              numberOfLines={1}
            >
              {mission.title}
            </Text>
            <Text style={[styles.progress, mission.completed && styles.doneText]}>
              {mission.current}
              {mission.suffix ?? ""}/{mission.target}
              {mission.suffix ?? ""}
            </Text>
          </View>
        ))}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 80,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: BLOCK_RADIUS - 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    zIndex: 12,
    gap: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: "900",
    color: Colors.textDim,
    letterSpacing: 1.4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 10,
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  dotDone: {
    color: Colors.primary,
    fontSize: 11,
  },
  missionText: {
    flex: 1,
    fontSize: 11,
    color: Colors.white,
    fontWeight: "600",
  },
  progress: {
    fontSize: 11,
    color: Colors.textDim,
    fontWeight: "800",
  },
  doneText: {
    color: Colors.primary,
  },
});

export default RunMissionsPanel;
