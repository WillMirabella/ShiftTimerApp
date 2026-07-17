import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { EditSessionModal } from "./src/components/EditSessionModal";
import { HistoryList } from "./src/components/HistoryList";
import { TimerDisplay } from "./src/components/TimerDisplay";
import { useTimer } from "./src/hooks/useTimer";
import { Session } from "./src/storage";

export default function App() {
  const { isRunning, elapsedMs, history, isLoading, toggle, editSession, deleteSession } =
    useTimer();
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {isLoading ? (
        <ActivityIndicator size="large" color="#d8d8d8" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Shift Timer</Text>
          <TimerDisplay isRunning={isRunning} elapsedMs={elapsedMs} onToggle={toggle} />
          <HistoryList sessions={history} onPressSession={setEditingSession} />
        </ScrollView>
      )}
      <EditSessionModal
        session={editingSession}
        onClose={() => setEditingSession(null)}
        onSave={editSession}
        onDelete={deleteSession}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingTop: 70,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: "#d8d8d8",
  },
});
