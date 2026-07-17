import { useCallback, useEffect, useRef, useState } from "react";
import {
  addSession,
  clearActiveSession,
  deleteSession as deleteSessionFromStorage,
  getActiveSession,
  getHistory,
  setActiveSession,
  Session,
  updateSessionTimes,
} from "../storage";

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [history, setHistory] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      const [active, pastSessions] = await Promise.all([
        getActiveSession(),
        getHistory(),
      ]);
      if (active) {
        setStartTime(active.startTime);
        setIsRunning(true);
        setElapsedMs(Date.now() - active.startTime);
      }
      setHistory(pastSessions);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!isRunning || startTime === null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, startTime]);

  const start = useCallback(async () => {
    const now = Date.now();
    await setActiveSession({ startTime: now });
    setStartTime(now);
    setElapsedMs(0);
    setIsRunning(true);
  }, []);

  const stop = useCallback(async () => {
    if (startTime === null) return;
    const endTime = Date.now();
    const session: Session = {
      id: `${startTime}-${endTime}`,
      startTime,
      endTime,
      durationMs: endTime - startTime,
    };
    const updatedHistory = await addSession(session);
    await clearActiveSession();
    setHistory(updatedHistory);
    setIsRunning(false);
    setStartTime(null);
    setElapsedMs(0);
  }, [startTime]);

  const toggle = useCallback(() => {
    if (isRunning) {
      void stop();
    } else {
      void start();
    }
  }, [isRunning, start, stop]);

  const editSession = useCallback(
    async (id: string, newStartTime: number, newEndTime: number) => {
      const updatedHistory = await updateSessionTimes(id, newStartTime, newEndTime);
      setHistory(updatedHistory);
    },
    []
  );

  const deleteSession = useCallback(async (id: string) => {
    const updatedHistory = await deleteSessionFromStorage(id);
    setHistory(updatedHistory);
  }, []);

  return {
    isRunning,
    elapsedMs,
    history,
    isLoading,
    toggle,
    editSession,
    deleteSession,
  };
}
