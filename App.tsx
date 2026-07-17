import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { HistoryList } from "./src/components/HistoryList";
import { TimerDisplay } from "./src/components/TimerDisplay";
import { useTimer } from "./src/hooks/useTimer";

export default function App() {
  const { isRunning, elapsedMs, history, isLoading, toggle } = useTimer();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Shift Timer</Text>
          <TimerDisplay isRunning={isRunning} elapsedMs={elapsedMs} onToggle={toggle} />
          <HistoryList sessions={history} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#1a1a1a",
  },
});
