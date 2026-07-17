import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Session } from "../storage";
import {
  colorForElapsed,
  formatDateLabel,
  formatDuration,
  formatTimeLabel,
} from "../utils/time";

const BADGE_COLORS: Record<ReturnType<typeof colorForElapsed>, string> = {
  green: "#2ecc71",
  yellow: "#f1c40f",
  red: "#e74c3c",
};

export function HistoryList({ sessions }: { sessions: Session[] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Past 7 Days</Text>
      {sessions.length === 0 ? (
        <Text style={styles.empty}>No sessions yet.</Text>
      ) : (
        sessions.map((session) => {
          const color = colorForElapsed(session.durationMs);
          return (
            <View key={session.id} style={styles.row}>
              <View style={[styles.badge, { backgroundColor: BADGE_COLORS[color] }]} />
              <View style={styles.rowText}>
                <Text style={styles.date}>{formatDateLabel(session.startTime)}</Text>
                <Text style={styles.times}>
                  {formatTimeLabel(session.startTime)} - {formatTimeLabel(session.endTime)}
                </Text>
              </View>
              <Text style={styles.duration}>{formatDuration(session.durationMs)}</Text>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1a1a1a",
  },
  empty: {
    color: "#888",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    gap: 12,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowText: {
    flex: 1,
  },
  date: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  times: {
    fontSize: 13,
    color: "#888",
  },
  duration: {
    fontSize: 15,
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
    color: "#1a1a1a",
  },
});
