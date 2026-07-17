import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVE_SESSION_KEY = "shift-timer:active-session";
const HISTORY_KEY = "shift-timer:history";
const HISTORY_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

export type ActiveSession = {
  startTime: number;
};

export type Session = {
  id: string;
  startTime: number;
  endTime: number;
  durationMs: number;
};

export async function getActiveSession(): Promise<ActiveSession | null> {
  const raw = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
  return raw ? (JSON.parse(raw) as ActiveSession) : null;
}

export async function setActiveSession(session: ActiveSession): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
}

export async function clearActiveSession(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
}

function pruneOldSessions(sessions: Session[]): Session[] {
  const cutoff = Date.now() - HISTORY_RETENTION_MS;
  return sessions.filter((s) => s.startTime >= cutoff);
}

export async function getHistory(): Promise<Session[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  const sessions: Session[] = raw ? JSON.parse(raw) : [];
  const pruned = pruneOldSessions(sessions);
  if (pruned.length !== sessions.length) {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(pruned));
  }
  return pruned.sort((a, b) => b.startTime - a.startTime);
}

export async function addSession(session: Session): Promise<Session[]> {
  const existing = await getHistory();
  const updated = pruneOldSessions([session, ...existing]);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated.sort((a, b) => b.startTime - a.startTime);
}
