import { events as allEvents } from "./fixtures";
import { addDays, dayOf, minutesOfDay, SAMPLE_TODAY, weekdayIndex } from "./time";
import type { CareEvent, Intensity, Support, Trend, Trigger } from "./types";

const intensityRank: Record<Intensity, number> = { low: 1, moderate: 2, high: 3 };

export function eventsFor(childId: string): readonly CareEvent[] {
  return allEvents.filter((event) => event.childId === childId);
}

export function eventsSince(list: readonly CareEvent[], day: string): CareEvent[] {
  return list.filter((event) => dayOf(event.at) > day);
}

export interface DayCell {
  readonly day: string;
  readonly events: readonly CareEvent[];
  readonly peak: Intensity | null;
}

export function dailyCells(list: readonly CareEvent[], days = 14): DayCell[] {
  return Array.from({ length: days }, (_, index) => {
    const day = addDays(SAMPLE_TODAY, index - days + 1);
    const dayEvents = list.filter((event) => dayOf(event.at) === day);
    const peak = dayEvents.reduce<Intensity | null>(
      (current, event) =>
        !current || intensityRank[event.intensity] > intensityRank[current] ? event.intensity : current,
      null,
    );
    return { day, events: dayEvents, peak };
  });
}

export function trendOf(list: readonly CareEvent[]): Trend {
  const recent = eventsSince(list, addDays(SAMPLE_TODAY, -7)).length;
  const prior = list.filter((event) => {
    const day = dayOf(event.at);
    return day > addDays(SAMPLE_TODAY, -14) && day <= addDays(SAMPLE_TODAY, -7);
  }).length;
  if (recent >= prior + 2) return "busier";
  if (recent <= prior - 2) return "calmer";
  return "steady";
}

export interface Ranked<T extends string> {
  readonly key: T;
  readonly count: number;
  readonly share: number;
}

export function rankTriggers(list: readonly CareEvent[]): Ranked<Trigger>[] {
  const counts = new Map<Trigger, number>();
  list.forEach((event) => counts.set(event.trigger, (counts.get(event.trigger) ?? 0) + 1));
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count, share: list.length ? count / list.length : 0 }))
    .sort((a, b) => b.count - a.count);
}

export interface SupportStat {
  readonly key: Support;
  readonly uses: number;
  readonly worked: number;
  readonly rate: number;
}

export function supportStats(list: readonly CareEvent[]): SupportStat[] {
  const stats = new Map<Support, { uses: number; worked: number }>();
  list.forEach((event) =>
    event.helped.forEach((support) => {
      const entry = stats.get(support) ?? { uses: 0, worked: 0 };
      entry.uses += 1;
      if (event.helpedWorked) entry.worked += 1;
      stats.set(support, entry);
    }),
  );
  return [...stats.entries()]
    .map(([key, value]) => ({ key, ...value, rate: value.uses ? value.worked / value.uses : 0 }))
    .sort((a, b) => b.rate * b.uses - a.rate * a.uses);
}

export const dayParts = ["early", "morning", "midday", "afternoon", "evening", "night"] as const;
export type DayPart = (typeof dayParts)[number];

export function dayPartOf(at: string): DayPart {
  const minutes = minutesOfDay(at);
  if (minutes < 5 * 60 || minutes >= 21 * 60) return "night";
  if (minutes < 8 * 60) return "early";
  if (minutes < 12 * 60) return "morning";
  if (minutes < 15 * 60) return "midday";
  if (minutes < 18 * 60) return "afternoon";
  return "evening";
}

/** Weekday by day-part matrix (scatterplot), weighted by intensity. */
export function rhythmGrid(list: readonly CareEvent[]): number[][] {
  const grid = dayParts.map(() => Array.from({ length: 7 }, () => 0));
  list.forEach((event) => {
    const row = grid[dayParts.indexOf(dayPartOf(event.at))];
    if (row) row[weekdayIndex(dayOf(event.at))] = (row[weekdayIndex(dayOf(event.at))] ?? 0) + intensityRank[event.intensity];
  });
  return grid;
}

export function medianRecovery(list: readonly CareEvent[]): number {
  if (!list.length) return 0;
  const sorted = [...list].map((event) => event.recoveryMin).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

export function intensityMix(list: readonly CareEvent[]): Record<Intensity, number> {
  return list.reduce(
    (mix, event) => ({ ...mix, [event.intensity]: mix[event.intensity] + 1 }),
    { low: 0, moderate: 0, high: 0 } as Record<Intensity, number>,
  );
}
