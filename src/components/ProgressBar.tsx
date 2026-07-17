import React from "react";
import { StyleSheet, View } from "react-native";
import { colorForElapsed, progressFraction } from "../utils/time";

const COLORS: Record<ReturnType<typeof colorForElapsed>, string> = {
  green: "#2ecc71",
  yellow: "#f1c40f",
  red: "#e74c3c",
};

export function ProgressBar({ elapsedMs }: { elapsedMs: number }) {
  const fraction = progressFraction(elapsedMs);
  const color = colorForElapsed(elapsedMs);

  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${fraction * 100}%`, backgroundColor: COLORS[color] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 24,
    borderRadius: 12,
    backgroundColor: "#333333",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 12,
  },
});
