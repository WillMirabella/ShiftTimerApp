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

export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function to12Hour(hour24: number): { hour12: number; isPM: boolean } {
  const isPM = hour24 >= 12;
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, isPM };
}

export function to24Hour(hour12: number, isPM: boolean): number {
  const base = hour12 % 12; // 12 -> 0, others unchanged
  return isPM ? base + 12 : base;
}

export function buildTimestamp(
  baseEpochMs: number,
  hour24: number,
  minute: number,
  dayOffset = 0
): number {
  const base = new Date(baseEpochMs);
  const d = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + dayOffset,
    hour24,
    minute,
    0,
    0
  );
  return d.getTime();
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
