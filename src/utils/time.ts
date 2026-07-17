export const HOUR_MS = 60 * 60 * 1000;

export const YELLOW_THRESHOLD_MS = 8 * HOUR_MS;
export const RED_THRESHOLD_MS = 10 * HOUR_MS;
export const BAR_MAX_MS = 12 * HOUR_MS;

export type BarColor = "green" | "yellow" | "red";

export function colorForElapsed(elapsedMs: number): BarColor {
  if (elapsedMs >= RED_THRESHOLD_MS) return "red";
  if (elapsedMs >= YELLOW_THRESHOLD_MS) return "yellow";
  return "green";
}

export function progressFraction(elapsedMs: number): number {
  return Math.min(elapsedMs / BAR_MAX_MS, 1);
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatDateLabel(epochMs: number): string {
  return new Date(epochMs).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeLabel(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
