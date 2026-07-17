import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "./ProgressBar";
import { formatDuration } from "../utils/time";

export function TimerDisplay({
  isRunning,
  elapsedMs,
  onToggle,
}: {
  isRunning: boolean;
  elapsedMs: number;
  onToggle: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.clock}>{formatDuration(elapsedMs)}</Text>
      <ProgressBar elapsedMs={elapsedMs} />
      <Pressable
        style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
        onPress={onToggle}
      >
        <Text style={styles.buttonText}>{isRunning ? "Stop" : "Start"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  clock: {
    fontSize: 48,
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
    color: "#d8d8d8",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  startButton: {
    backgroundColor: "#2ecc71",
  },
  stopButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
